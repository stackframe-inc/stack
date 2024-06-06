import { getProvider } from "@/oauth";
import { prismaClient } from "@/prisma-client";
import { createCrudHandlers } from "@/route-handlers/crud-handler";
import { KnownErrors } from "@stackframe/stack-shared";
import { accessTokenCrud } from "@stackframe/stack-shared/dist/interface/crud/oauth";
import { StackAssertionError, StatusError } from "@stackframe/stack-shared/dist/utils/errors";
import { extractScopes } from "@stackframe/stack-shared/dist/utils/strings";

const crudHandlers = createCrudHandlers(accessTokenCrud, {
  paramNames: ['provider'],
  async onRead() {
    throw Error('Not implemented');
  },
  async onCreate({ auth, data, params }) {
    if (!auth.user) throw new KnownErrors.UserNotFound();
    const provider = auth.project.evaluatedConfig.oauthProviders.find((p) => p.id === params.provider);
    if (!provider) {
      throw new StatusError(StatusError.NotFound, "Provider not found");
    }
    if (!provider.enabled) {
      throw new StatusError(StatusError.NotFound, "Provider not enabled");
    }

    if (!auth.user.oauthProviders.includes(params.provider)) {
      throw new KnownErrors.OAuthAccountNotConnectedToUser();
    }

    const tokens = await prismaClient.oAuthToken.findMany({
      where: {
        projectId: auth.project.id,
        oAuthProviderConfigId: params.provider,
        projectUserOAuthAccount: {
          projectUserId: auth.user.id,
        }
      },
    });

    const filteredTokens = tokens.filter((t) => {
      return extractScopes(data.scope || "").every((scope) => t.scopes.includes(scope));
    });

    if (filteredTokens.length === 0) {
      throw new KnownErrors.OAuthAccountDoesNotHaveRequiredScope();
    }

    const tokenSet = await getProvider(provider).getAccessToken({
      refreshToken: filteredTokens[0].refreshToken,
      scope: data.scope,
    });

    if (!tokenSet.access_token) {
      throw new StackAssertionError("No access token returned");
    }

    return {
      accessToken: tokenSet.access_token,
    };
  },
});

export const POST = crudHandlers.createHandler;
