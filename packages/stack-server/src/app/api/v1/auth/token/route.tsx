import * as yup from "yup";
import { InvalidGrantError, Request as OauthRequest, Response as OauthResponse, InvalidClientError } from "@node-oauth/oauth2-server";
import { NextRequest, NextResponse } from "next/server";
import { oauthServer } from "@/oauth";
import { parseRequest, smartRouteHandler } from "@/lib/route-handlers";
import { GrantInvalidErrorCode, ProjectIdOrKeyInvalidErrorCode, KnownError } from "stack-shared/dist/utils/types";

// make this specific to each grant type later
const postSchema = yup.object({
  body: yup.object({
    grant_type: yup.string().required(),
    code: yup.string(),
    code_verifier: yup.string(),
    redirect_uri: yup.string(),
    refresh_token: yup.string(),
  })
});

export const POST = smartRouteHandler(async (req: NextRequest) => {
  const { body } = await parseRequest(req, postSchema);
  if (body.redirect_uri) {
    body.redirect_uri = body.redirect_uri.split('#')[0]; // remove hash
  }
  const oauthRequest = new OauthRequest({
    headers: Object.fromEntries(req.headers.entries()),
    query: Object.fromEntries(new URL(req.url).searchParams.entries()),
    method: "POST",
    body: body,
  });

  const oauthResponse = new OauthResponse();
  try {
    await oauthServer.token(
      oauthRequest, 
      oauthResponse, 
      {
        // note the `accessTokenLifetime` won't have any effect here because we set it in the `generateAccessToken` function
        refreshTokenLifetime: 60 * 60 * 24 * 365, // 1 year
        alwaysIssueNewRefreshToken: false, // add token rotation later
      }
    );
  } catch (e) {
    if (e instanceof InvalidGrantError) {
      throw new KnownError(GrantInvalidErrorCode);
    }
    if (e instanceof InvalidClientError) {
      throw new KnownError(ProjectIdOrKeyInvalidErrorCode);
    }
    throw e;
  }

  return new Response(JSON.stringify(oauthResponse.body), {
    status: oauthResponse.status,
    headers: oauthResponse.headers
  });
});
