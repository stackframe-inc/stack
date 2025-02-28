import { WebAuthnError, startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { KnownErrors, StackAdminInterface, StackClientInterface, StackServerInterface } from "@stackframe/stack-shared";
import { ProductionModeError, getProductionModeErrors } from "@stackframe/stack-shared/dist/helpers/production-mode";
import { ApiKeyCreateCrudRequest, ApiKeyCreateCrudResponse } from "@stackframe/stack-shared/dist/interface/adminInterface";
import { ApiKeysCrud } from "@stackframe/stack-shared/dist/interface/crud/api-keys";
import { ContactChannelsCrud } from "@stackframe/stack-shared/dist/interface/crud/contact-channels";
import { CurrentUserCrud } from "@stackframe/stack-shared/dist/interface/crud/current-user";
import { EmailTemplateCrud, EmailTemplateType } from "@stackframe/stack-shared/dist/interface/crud/email-templates";
import { InternalProjectsCrud, ProjectsCrud } from "@stackframe/stack-shared/dist/interface/crud/projects";
import { TeamInvitationCrud } from "@stackframe/stack-shared/dist/interface/crud/team-invitation";
import { TeamMemberProfilesCrud } from "@stackframe/stack-shared/dist/interface/crud/team-member-profiles";
import { TeamPermissionDefinitionsCrud, TeamPermissionsCrud } from "@stackframe/stack-shared/dist/interface/crud/team-permissions";
import { TeamsCrud } from "@stackframe/stack-shared/dist/interface/crud/teams";
import { UsersCrud } from "@stackframe/stack-shared/dist/interface/crud/users";
import { InternalSession } from "@stackframe/stack-shared/dist/sessions";
import { encodeBase64 } from "@stackframe/stack-shared/dist/utils/bytes";
import { AsyncCache } from "@stackframe/stack-shared/dist/utils/caches";
import { scrambleDuringCompileTime } from "@stackframe/stack-shared/dist/utils/compile-time";
import { isBrowserLike } from "@stackframe/stack-shared/dist/utils/env";
import { StackAssertionError, concatStacktraces, throwErr } from "@stackframe/stack-shared/dist/utils/errors";
import { ReadonlyJson } from "@stackframe/stack-shared/dist/utils/json";
import { DependenciesMap } from "@stackframe/stack-shared/dist/utils/maps";
import { ProviderType } from "@stackframe/stack-shared/dist/utils/oauth";
import { deepPlainEquals, filterUndefined, omit, pick } from "@stackframe/stack-shared/dist/utils/objects";
import { ReactPromise, neverResolve, runAsynchronously, wait } from "@stackframe/stack-shared/dist/utils/promises";
import { suspend, suspendIfSsr } from "@stackframe/stack-shared/dist/utils/react";
import { Result } from "@stackframe/stack-shared/dist/utils/results";
import { Store, storeLock } from "@stackframe/stack-shared/dist/utils/stores";
import { mergeScopeStrings } from "@stackframe/stack-shared/dist/utils/strings";
import { getRelativePart, isRelative } from "@stackframe/stack-shared/dist/utils/urls";
import { generateUuid } from "@stackframe/stack-shared/dist/utils/uuids";
import * as cookie from "cookie";

import { constructRedirectUrl } from "../../../../utils/url";
import { addNewOAuthProviderOrScope, callOAuthCallback, signInWithOAuth } from "../../../auth";
import { CookieHelper, createBrowserCookieHelper, createCookieHelper, createPlaceholderCookieHelper, deleteCookieClient, getCookieClient, setOrDeleteCookie, setOrDeleteCookieClient } from "../../../cookie";
import { HandlerUrls, OAuthScopesOnSignIn, TokenStoreInit, RedirectMethod, GetUserOptions, stackAppInternalsSymbol, AsyncStoreProperty, RedirectToOptions } from "../../common";
import { Project } from "../../projects";
import { ProjectCurrentUser } from "../../users";
import { _StackClientAppImpl } from "../implementations/client-app-impl";


export type StackClientAppConstructorOptions<HasTokenStore extends boolean, ProjectId extends string> = {
  baseUrl?: string | { browser: string, server: string },
  projectId?: ProjectId,
  publishableClientKey?: string,
  urls?: Partial<HandlerUrls>,
  oauthScopesOnSignIn?: Partial<OAuthScopesOnSignIn>,
  tokenStore: TokenStoreInit<HasTokenStore>,
  redirectMethod?: RedirectMethod,

  /**
   * By default, the Stack app will automatically prefetch some data from Stack's server when this app is first
   * constructed. This improves the performance of your app, but will create network requests that are unnecessary if
   * the app is never used or disposed of immediately. To disable this behavior, set this option to true.
   */
  noAutomaticPrefetch?: boolean,
};


export type StackClientAppJson<HasTokenStore extends boolean, ProjectId extends string> = StackClientAppConstructorOptions<HasTokenStore, ProjectId> & {
  uniqueIdentifier: string,
  // note: if you add more fields here, make sure to ensure the checkString in the constructor has/doesn't have them
};

export type StackClientApp<HasTokenStore extends boolean = boolean, ProjectId extends string = string> = (
  & {
    readonly projectId: ProjectId,

    readonly urls: Readonly<HandlerUrls>,

    signInWithOAuth(provider: string): Promise<void>,
    signInWithCredential(options: { email: string, password: string, noRedirect?: boolean }): Promise<Result<undefined, KnownErrors["EmailPasswordMismatch"] | KnownErrors["InvalidTotpCode"]>>,
    signUpWithCredential(options: { email: string, password: string, noRedirect?: boolean, verificationCallbackUrl?: string }): Promise<Result<undefined, KnownErrors["UserEmailAlreadyExists"] | KnownErrors["PasswordRequirementsNotMet"]>>,
    signInWithPasskey(): Promise<Result<undefined, KnownErrors["PasskeyAuthenticationFailed"]| KnownErrors["InvalidTotpCode"] | KnownErrors["PasskeyWebAuthnError"]>>,
    callOAuthCallback(): Promise<boolean>,
    sendForgotPasswordEmail(email: string, options?: { callbackUrl?: string }): Promise<Result<undefined, KnownErrors["UserNotFound"]>>,
    sendMagicLinkEmail(email: string, options?: { callbackUrl?: string }): Promise<Result<{ nonce: string }, KnownErrors["RedirectUrlNotWhitelisted"]>>,
    resetPassword(options: { code: string, password: string }): Promise<Result<undefined, KnownErrors["VerificationCodeError"]>>,
    verifyPasswordResetCode(code: string): Promise<Result<undefined, KnownErrors["VerificationCodeError"]>>,
    verifyTeamInvitationCode(code: string): Promise<Result<undefined, KnownErrors["VerificationCodeError"]>>,
    acceptTeamInvitation(code: string): Promise<Result<undefined, KnownErrors["VerificationCodeError"]>>,
    getTeamInvitationDetails(code: string): Promise<Result<{ teamDisplayName: string }, KnownErrors["VerificationCodeError"]>>,
    verifyEmail(code: string): Promise<Result<undefined, KnownErrors["VerificationCodeError"]>>,
    signInWithMagicLink(code: string): Promise<Result<undefined, KnownErrors["VerificationCodeError"] | KnownErrors["InvalidTotpCode"]>>,

    redirectToOAuthCallback(): Promise<void>,

    // IF_PLATFORM react-like
    useUser(options: GetUserOptions<HasTokenStore> & { or: 'redirect' }): ProjectCurrentUser<ProjectId>,
    useUser(options: GetUserOptions<HasTokenStore> & { or: 'throw' }): ProjectCurrentUser<ProjectId>,
    useUser(options?: GetUserOptions<HasTokenStore>): ProjectCurrentUser<ProjectId> | null,
    // END_PLATFORM

    getUser(options: GetUserOptions<HasTokenStore> & { or: 'redirect' }): Promise<ProjectCurrentUser<ProjectId>>,
    getUser(options: GetUserOptions<HasTokenStore> & { or: 'throw' }): Promise<ProjectCurrentUser<ProjectId>>,
    getUser(options?: GetUserOptions<HasTokenStore>): Promise<ProjectCurrentUser<ProjectId> | null>,

    // NEXT_LINE_PLATFORM react-like
    useNavigate(): (to: string) => void,

    [stackAppInternalsSymbol]: {
      toClientJson(): StackClientAppJson<HasTokenStore, ProjectId>,
      setCurrentUser(userJsonPromise: Promise<CurrentUserCrud['Client']['Read'] | null>): void,
    },
  }
  & AsyncStoreProperty<"project", [], Project, false>
  & { [K in `redirectTo${Capitalize<keyof Omit<HandlerUrls, 'handler' | 'oauthCallback'>>}`]: (options?: RedirectToOptions) => Promise<void> }
);
export type StackClientAppConstructor = {
  new <
    TokenStoreType extends string,
    HasTokenStore extends (TokenStoreType extends {} ? true : boolean),
    ProjectId extends string
  >(options: StackClientAppConstructorOptions<HasTokenStore, ProjectId>): StackClientApp<HasTokenStore, ProjectId>,
  new (options: StackClientAppConstructorOptions<boolean, string>): StackClientApp<boolean, string>,

  [stackAppInternalsSymbol]: {
    fromClientJson<HasTokenStore extends boolean, ProjectId extends string>(
      json: StackClientAppJson<HasTokenStore, ProjectId>
    ): StackClientApp<HasTokenStore, ProjectId>,
  },
};
export const StackClientApp: StackClientAppConstructor = _StackClientAppImpl;
