
import { it, updateCookiesFromResponse } from "../../../../../../helpers";
import { ApiKey, Auth, Project, niceBackendFetch } from "../../../../../backend-helpers";

it("should return outer authorization code when inner callback url is valid", async ({ expect }) => {
  const response = await Auth.OAuth.getAuthorizationCode();
  expect(response.authorizationCode).toBeTruthy();
});

it("should fail when inner callback has invalid provider ID", async ({ expect }) => {
  const getInnerCallbackUrlResponse = await Auth.OAuth.getInnerCallbackUrl();
  const innerCallbackUrl = new URL(getInnerCallbackUrlResponse.innerCallbackUrl);
  innerCallbackUrl.pathname = "/api/v1/auth/oauth/callback/microsoft";
  const cookie = updateCookiesFromResponse("", getInnerCallbackUrlResponse.authorizeResponse);
  const response = await niceBackendFetch(innerCallbackUrl, {
    redirect: "manual",
    headers: {
      cookie,
    },
  });
  expect(response).toMatchInlineSnapshot(`
    NiceResponse {
      "status": 400,
      "body": {
        "code": "INVALID_AUTHORIZATION_CODE",
        "error": "The given authorization code is invalid.",
      },
      "headers": Headers {
        "set-cookie": <deleting cookie 'stack-oauth-inner-<stripped cookie name key>' at path '/'>,
        "x-stack-known-error": "INVALID_AUTHORIZATION_CODE",
        <some fields may have been hidden>,
      },
    }
  `);
});

it("should fail when account is new and sign ups are disabled", async ({ expect }) => {
  await Project.createAndSwitch({ config: { sign_up_enabled: false, oauth_providers: [ { id: "facebook", type: "shared", enabled: true } ] } });
  await ApiKey.createAndSetProjectKeys();
  const getInnerCallbackUrlResponse = await Auth.OAuth.getInnerCallbackUrl();
  const cookie = updateCookiesFromResponse("", getInnerCallbackUrlResponse.authorizeResponse);
  const response = await niceBackendFetch(getInnerCallbackUrlResponse.innerCallbackUrl, {
    redirect: "manual",
    headers: {
      cookie,
    },
  });
  expect(response).toMatchInlineSnapshot(`
    NiceResponse {
      "status": 400,
      "body": {
        "code": "SIGN_UP_NOT_ENABLED",
        "error": "Creation of new accounts is not enabled for this project. Please ask the project owner to enable it.",
      },
      "headers": Headers {
        "set-cookie": <deleting cookie 'stack-oauth-inner-<stripped cookie name key>' at path '/'>,
        "x-stack-known-error": "SIGN_UP_NOT_ENABLED",
        <some fields may have been hidden>,
      },
    }
  `);
});

it("should fail when cookies are missing", async ({ expect }) => {
  const getInnerCallbackUrlResponse = await Auth.OAuth.getInnerCallbackUrl();
  const response = await niceBackendFetch(getInnerCallbackUrlResponse.innerCallbackUrl, {
    redirect: "manual",
  });
  expect(response).toMatchInlineSnapshot(`
    NiceResponse {
      "status": 400,
      "body": "OAuth cookie not found. This is likely because you refreshed the page during the OAuth sign in process. Please try signing in again",
      "headers": Headers {
        "set-cookie": <deleting cookie 'stack-oauth-inner-<stripped cookie name key>' at path '/'>,
        <some fields may have been hidden>,
      },
    }
  `);
});

it("should fail when inner callback has invalid authorization code", async ({ expect }) => {
  const getInnerCallbackUrlResponse = await Auth.OAuth.getInnerCallbackUrl();
  const innerCallbackUrl = new URL(getInnerCallbackUrlResponse.innerCallbackUrl);
  innerCallbackUrl.searchParams.set("code", "invalid-authorization-code");
  const cookie = updateCookiesFromResponse("", getInnerCallbackUrlResponse.authorizeResponse);
  const response = await niceBackendFetch(innerCallbackUrl, {
    redirect: "manual",
    headers: {
      cookie,
    },
  });
  expect(response).toMatchInlineSnapshot(`
    NiceResponse {
      "status": 400,
      "body": {
        "code": "INVALID_AUTHORIZATION_CODE",
        "error": "The given authorization code is invalid.",
      },
      "headers": Headers {
        "set-cookie": <deleting cookie 'stack-oauth-inner-<stripped cookie name key>' at path '/'>,
        "x-stack-known-error": "INVALID_AUTHORIZATION_CODE",
        <some fields may have been hidden>,
      },
    }
  `);
});

it("should fail when inner callback has invalid state", async ({ expect }) => {
  const getInnerCallbackUrlResponse = await Auth.OAuth.getInnerCallbackUrl();
  const innerCallbackUrl = new URL(getInnerCallbackUrlResponse.innerCallbackUrl);
  innerCallbackUrl.searchParams.set("state", "invalid-state");
  const cookie = updateCookiesFromResponse("", getInnerCallbackUrlResponse.authorizeResponse);
  const response = await niceBackendFetch(innerCallbackUrl, {
    redirect: "manual",
    headers: {
      cookie,
    },
  });
  expect(response).toMatchInlineSnapshot(`
    NiceResponse {
      "status": 400,
      "body": "OAuth cookie not found. This is likely because you refreshed the page during the OAuth sign in process. Please try signing in again",
      "headers": Headers {
        "set-cookie": <deleting cookie 'stack-oauth-inner-<stripped cookie name key>' at path '/'>,
        <some fields may have been hidden>,
      },
    }
  `);
});

it("should fail if an untrusted redirect URL is provided", async ({ expect }) => {
  const authorize = await Auth.OAuth.authorize({ redirectUrl: "http://untrusted-redirect-url.stack-test.example.com" });
  const getInnerCallbackUrlResponse = await Auth.OAuth.getInnerCallbackUrl(authorize);
  const cookie = updateCookiesFromResponse("", getInnerCallbackUrlResponse.authorizeResponse);
  const response = await niceBackendFetch(getInnerCallbackUrlResponse.innerCallbackUrl, {
    redirect: "manual",
    headers: {
      cookie,
    },
  });
  expect(response).toMatchInlineSnapshot(`
    NiceResponse {
      "status": 400,
      "body": "Invalid redirect URL. Please ensure you set up domains and handlers correctly in Stack's dashboard.",
      "headers": Headers {
        "set-cookie": <deleting cookie 'stack-oauth-inner-<stripped cookie name key>' at path '/'>,
        <some fields may have been hidden>,
      },
    }
  `);
});

it("should fail when MFA is required", async ({ expect }) => {
  await Auth.OAuth.signIn();
  await Auth.Mfa.setupTotpMfa();
  await Auth.signOut();

  const getInnerCallbackUrlResponse = await Auth.OAuth.getInnerCallbackUrl();
  const cookie = updateCookiesFromResponse("", getInnerCallbackUrlResponse.authorizeResponse);
  const response = await niceBackendFetch(getInnerCallbackUrlResponse.innerCallbackUrl, {
    redirect: "manual",
    headers: {
      cookie,
    },
  });
  expect(response).toMatchInlineSnapshot(`
    NiceResponse {
      "status": 400,
      "body": {
        "code": "MULTI_FACTOR_AUTHENTICATION_REQUIRED",
        "details": { "attempt_code": <stripped field 'attempt_code'> },
        "error": "Multi-factor authentication is required for this user.",
      },
      "headers": Headers {
        "set-cookie": <deleting cookie 'stack-oauth-inner-<stripped cookie name key>' at path '/'>,
        "x-stack-known-error": "MULTI_FACTOR_AUTHENTICATION_REQUIRED",
        <some fields may have been hidden>,
      },
    }
  `);
});
