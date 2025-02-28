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

import { constructRedirectUrl } from "../../../utils/url";
import { addNewOAuthProviderOrScope, callOAuthCallback, signInWithOAuth } from "../../auth";
import { CookieHelper, createBrowserCookieHelper, createCookieHelper, createPlaceholderCookieHelper, deleteCookieClient, getCookieClient, setOrDeleteCookie, setOrDeleteCookieClient } from "../../cookie";
import { AdminTeamPermission } from "../permissions";


type _______________PROJECT_CONFIG_______________ = never;  // this is a marker for VSCode's outline view

export type ProjectConfig = {
  readonly signUpEnabled: boolean,
  readonly credentialEnabled: boolean,
  readonly magicLinkEnabled: boolean,
  readonly passkeyEnabled: boolean,
  readonly clientTeamCreationEnabled: boolean,
  readonly clientUserDeletionEnabled: boolean,
  readonly oauthProviders: OAuthProviderConfig[],
};

export type OAuthProviderConfig = {
  readonly id: string,
};

export type AdminProjectConfig = {
  readonly id: string,
  readonly signUpEnabled: boolean,
  readonly credentialEnabled: boolean,
  readonly magicLinkEnabled: boolean,
  readonly passkeyEnabled: boolean,
  readonly clientTeamCreationEnabled: boolean,
  readonly clientUserDeletionEnabled: boolean,
  readonly allowLocalhost: boolean,
  readonly oauthProviders: AdminOAuthProviderConfig[],
  readonly emailConfig?: AdminEmailConfig,
  readonly domains: AdminDomainConfig[],
  readonly createTeamOnSignUp: boolean,
  readonly teamCreatorDefaultPermissions: AdminTeamPermission[],
  readonly teamMemberDefaultPermissions: AdminTeamPermission[],
};

export type AdminEmailConfig = (
  {
    type: "standard",
    senderName: string,
    senderEmail: string,
    host: string,
    port: number,
    username: string,
    password: string,
  }
  | {
    type: "shared",
  }
);

export type AdminDomainConfig = {
  domain: string,
  handlerPath: string,
};

export type AdminOAuthProviderConfig = {
  id: string,
  enabled: boolean,
} & (
  | { type: 'shared' }
  | {
    type: 'standard',
    clientId: string,
    clientSecret: string,
    facebookConfigId?: string,
    microsoftTenantId?: string,
  }
) & OAuthProviderConfig;

export type AdminProjectConfigUpdateOptions = {
  domains?: {
    domain: string,
    handlerPath: string,
  }[],
  oauthProviders?: AdminOAuthProviderConfig[],
  signUpEnabled?: boolean,
  credentialEnabled?: boolean,
  magicLinkEnabled?: boolean,
  passkeyEnabled?: boolean,
  clientTeamCreationEnabled?: boolean,
  clientUserDeletionEnabled?: boolean,
  allowLocalhost?: boolean,
  createTeamOnSignUp?: boolean,
  emailConfig?: AdminEmailConfig,
  teamCreatorDefaultPermissions?: { id: string }[],
  teamMemberDefaultPermissions?: { id: string }[],
};
