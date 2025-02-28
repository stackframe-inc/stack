import { HandlerUrls } from "../../interface/client-app";
import { filterUndefined } from "@stackframe/stack-shared/dist/utils/objects";
import { throwErr } from "@stackframe/stack-shared/dist/utils/errors";
import { isBrowserLike } from "@stackframe/stack-shared/dist/utils/env";

// Utility functions from the original file

export function getUrls(partial: Partial<HandlerUrls>): HandlerUrls {
  const handler = partial.handler ?? "/handler";
  const home = partial.home ?? "/";
  const afterSignIn = partial.afterSignIn ?? home;
  return {
    handler,
    signIn: `${handler}/sign-in`,
    afterSignIn: afterSignIn, // Fix: use afterSignIn variable instead of home
    signUp: `${handler}/sign-up`,
    afterSignUp: afterSignIn,
    signOut: `${handler}/sign-out`,
    afterSignOut: home,
    emailVerification: `${handler}/email-verification`,
    passwordReset: `${handler}/password-reset`,
    forgotPassword: `${handler}/forgot-password`,
    oauthCallback: `${handler}/oauth-callback`,
    magicLinkCallback: `${handler}/magic-link-callback`,
    home: home,
    accountSettings: `${handler}/account-settings`,
    error: `${handler}/error`,
    teamInvitation: `${handler}/team-invitation`,
    ...filterUndefined(partial),
  };
}

export function getDefaultProjectId() {
  return process.env.NEXT_PUBLIC_STACK_PROJECT_ID || throwErr(new Error("Welcome to Stack Auth! It seems that you haven't provided a project ID. Please create a project on the Stack dashboard at https://app.stack-auth.com and put it in the NEXT_PUBLIC_STACK_PROJECT_ID environment variable."));
}

export function getDefaultPublishableClientKey() {
  return process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || throwErr(new Error("Welcome to Stack Auth! It seems that you haven't provided a publishable client key. Please create an API key for your project on the Stack dashboard at https://app.stack-auth.com and copy your publishable client key into the NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY environment variable."));
}

export function getDefaultSecretServerKey() {
  return process.env.STACK_SECRET_SERVER_KEY || throwErr(new Error("No secret server key provided. Please copy your key from the Stack dashboard and put your it in the STACK_SECRET_SERVER_KEY environment variable."));
}

export function getDefaultSuperSecretAdminKey() {
  return process.env.STACK_SUPER_SECRET_ADMIN_KEY || throwErr(new Error("No super secret admin key provided. Please copy your key from the Stack dashboard and put it in the STACK_SUPER_SECRET_ADMIN_KEY environment variable."));
}

/**
 * Returns the base URL for the Stack API.
 *
 * The URL can be specified in several ways, in order of precedence:
 * 1. Directly through userSpecifiedBaseUrl parameter as string or browser/server object
 * 2. Through environment variables:
 *    - Browser: NEXT_PUBLIC_BROWSER_STACK_API_URL
 *    - Server: NEXT_PUBLIC_SERVER_STACK_API_URL
 *    - Fallback: NEXT_PUBLIC_STACK_API_URL or NEXT_PUBLIC_STACK_URL
 * 3. Default base URL if none of the above are specified
 *
 * The function also ensures the URL doesn't end with a trailing slash
 * by removing it if present.
 *
 * @param userSpecifiedBaseUrl - Optional URL override as string or {browser, server} object
 * @returns The configured base URL without trailing slash
 */
export function getBaseUrl(userSpecifiedBaseUrl: string | { browser: string, server: string } | undefined) {
  const defaultBaseUrl = "https://api.stack-auth.com";
  
  let url = defaultBaseUrl;
  if (userSpecifiedBaseUrl) {
    if (typeof userSpecifiedBaseUrl === "string") {
      url = userSpecifiedBaseUrl;
    } else {
      if (isBrowserLike()) {
        url = userSpecifiedBaseUrl.browser;
      } else {
        url = userSpecifiedBaseUrl.server;
      }
    }
  } else {
    if (isBrowserLike()) {
      url = process.env.NEXT_PUBLIC_BROWSER_STACK_API_URL || "";
    } else {
      url = process.env.NEXT_PUBLIC_SERVER_STACK_API_URL || "";
    }
    url = url || process.env.NEXT_PUBLIC_STACK_API_URL || process.env.NEXT_PUBLIC_STACK_URL || defaultBaseUrl;
  }

  return url.endsWith('/') ? url.slice(0, -1) : url;
}

// hack to make sure process is defined in non-node environments
// NEXT_LINE_PLATFORM js react
const process = (globalThis as any).process ?? { env: {} };
