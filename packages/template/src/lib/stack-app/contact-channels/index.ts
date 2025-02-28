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




type _______________CONTACT_CHANNEL_______________ = never;  // this is a marker for VSCode's outline view

export type ContactChannel = {
  id: string,
  value: string,
  type: 'email',
  isPrimary: boolean,
  isVerified: boolean,
  usedForAuth: boolean,

  sendVerificationEmail(): Promise<void>,
  update(data: ContactChannelUpdateOptions): Promise<void>,
  delete(): Promise<void>,
}

export type ContactChannelCreateOptions = {
  value: string,
  type: 'email',
  usedForAuth: boolean,
}

export function contactChannelCreateOptionsToCrud(userId: string, options: ContactChannelCreateOptions): ContactChannelsCrud["Client"]["Create"] {
  return {
    value: options.value,
    type: options.type,
    used_for_auth: options.usedForAuth,
    user_id: userId,
  };
}

export type ContactChannelUpdateOptions = {
  usedForAuth?: boolean,
  value?: string,
  isPrimary?: boolean,
}

export function contactChannelUpdateOptionsToCrud(options: ContactChannelUpdateOptions): ContactChannelsCrud["Client"]["Update"] {
  return {
    value: options.value,
    used_for_auth: options.usedForAuth,
    is_primary: options.isPrimary,
  };
}

export type ServerContactChannel = ContactChannel & {
  update(data: ServerContactChannelUpdateOptions): Promise<void>,
}
export type ServerContactChannelUpdateOptions = ContactChannelUpdateOptions & {
  isVerified?: boolean,
}

export function serverContactChannelUpdateOptionsToCrud(options: ServerContactChannelUpdateOptions): ContactChannelsCrud["Server"]["Update"] {
  return {
    value: options.value,
    is_verified: options.isVerified,
    used_for_auth: options.usedForAuth,
  };
}

export type ServerContactChannelCreateOptions = ContactChannelCreateOptions & {
  isVerified?: boolean,
}
export function serverContactChannelCreateOptionsToCrud(userId: string, options: ServerContactChannelCreateOptions): ContactChannelsCrud["Server"]["Create"] {
  return {
    type: options.type,
    value: options.value,
    is_verified: options.isVerified,
    user_id: userId,
    used_for_auth: options.usedForAuth,
  };
}
