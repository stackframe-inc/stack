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


export type ApiKeyBase = {
  id: string,
  description: string,
  expiresAt: Date,
  manuallyRevokedAt: Date | null,
  createdAt: Date,
  isValid(): boolean,
  whyInvalid(): "expired" | "manually-revoked" | null,
  revoke(): Promise<void>,
};

export type ApiKeyBaseCrudRead = Pick<ApiKeysCrud["Admin"]["Read"], "id" | "created_at_millis" | "description" | "expires_at_millis" | "manually_revoked_at_millis">;

export type ApiKeyFirstView = {
  publishableClientKey?: string,
  secretServerKey?: string,
  superSecretAdminKey?: string,
} & ApiKeyBase;

export type ApiKey = {
  publishableClientKey: null | {
    lastFour: string,
  },
  secretServerKey: null | {
    lastFour: string,
  },
  superSecretAdminKey: null | {
    lastFour: string,
  },
} & ApiKeyBase;

export type ApiKeyCreateOptions = {
  description: string,
  expiresAt: Date,
  hasPublishableClientKey: boolean,
  hasSecretServerKey: boolean,
  hasSuperSecretAdminKey: boolean,
};
export function apiKeyCreateOptionsToCrud(options: ApiKeyCreateOptions): ApiKeyCreateCrudRequest {
  return {
    description: options.description,
    expires_at_millis: options.expiresAt.getTime(),
    has_publishable_client_key: options.hasPublishableClientKey,
    has_secret_server_key: options.hasSecretServerKey,
    has_super_secret_admin_key: options.hasSuperSecretAdminKey,
  };
}
