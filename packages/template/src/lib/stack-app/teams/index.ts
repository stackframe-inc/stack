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
import { ServerUser } from "../users";


type _______________TEAM_______________ = never;  // this is a marker for VSCode's outline view
type ___________client_team = never;  // this is a marker for VSCode's outline view

export type TeamMemberProfile = {
  displayName: string | null,
  profileImageUrl: string | null,
}

export type TeamMemberProfileUpdateOptions = {
  displayName?: string,
  profileImageUrl?: string | null,
};

export type EditableTeamMemberProfile = TeamMemberProfile & {
  update(update: TeamMemberProfileUpdateOptions): Promise<void>,
}

export type TeamUser = {
  id: string,
  teamProfile: TeamMemberProfile,
}

export type TeamInvitation = {
  id: string,
  recipientEmail: string | null,
  expiresAt: Date,
  revoke(): Promise<void>,
}

export type Team = {
  id: string,
  displayName: string,
  profileImageUrl: string | null,
  clientMetadata: any,
  clientReadOnlyMetadata: any,
  inviteUser(options: { email: string, callbackUrl?: string }): Promise<void>,
  listUsers(): Promise<TeamUser[]>,
  // NEXT_LINE_PLATFORM react-like
  useUsers(): TeamUser[],
  listInvitations(): Promise<TeamInvitation[]>,
  // NEXT_LINE_PLATFORM react-like
  useInvitations(): TeamInvitation[],
  update(update: TeamUpdateOptions): Promise<void>,
  delete(): Promise<void>,
};

export type TeamUpdateOptions = {
  displayName?: string,
  profileImageUrl?: string | null,
  clientMetadata?: ReadonlyJson,
};
export function teamUpdateOptionsToCrud(options: TeamUpdateOptions): TeamsCrud["Client"]["Update"] {
  return {
    display_name: options.displayName,
    profile_image_url: options.profileImageUrl,
    client_metadata: options.clientMetadata,
  };
}

export type TeamCreateOptions = {
  displayName: string,
  profileImageUrl?: string,
}
export function teamCreateOptionsToCrud(options: TeamCreateOptions, creatorUserId: string): TeamsCrud["Client"]["Create"] {
  return {
    display_name: options.displayName,
    profile_image_url: options.profileImageUrl,
    creator_user_id: creatorUserId,
  };
}

type ___________server_team = never;  // this is a marker for VSCode's outline view

export type ServerTeamMemberProfile = TeamMemberProfile;

export type ServerTeamUser = ServerUser & {
  teamProfile: ServerTeamMemberProfile,
}

export type ServerTeam = {
  createdAt: Date,
  serverMetadata: any,
  listUsers(): Promise<ServerTeamUser[]>,
  // NEXT_LINE_PLATFORM react-like
  useUsers(): ServerUser[],
  update(update: ServerTeamUpdateOptions): Promise<void>,
  delete(): Promise<void>,
  addUser(userId: string): Promise<void>,
  inviteUser(options: { email: string, callbackUrl?: string }): Promise<void>,
  removeUser(userId: string): Promise<void>,
} & Team;

export type ServerListUsersOptions = {
  cursor?: string,
  limit?: number,
  orderBy?: 'signedUpAt',
  desc?: boolean,
  query?: string,
};

export type ServerTeamCreateOptions = TeamCreateOptions & {
  creatorUserId?: string,
};
export function serverTeamCreateOptionsToCrud(options: ServerTeamCreateOptions): TeamsCrud["Server"]["Create"] {
  return {
    display_name: options.displayName,
    profile_image_url: options.profileImageUrl,
    creator_user_id: options.creatorUserId,
  };
}

export type ServerTeamUpdateOptions = TeamUpdateOptions & {
  clientReadOnlyMetadata?: ReadonlyJson,
  serverMetadata?: ReadonlyJson,
};
export function serverTeamUpdateOptionsToCrud(options: ServerTeamUpdateOptions): TeamsCrud["Server"]["Update"] {
  return {
    display_name: options.displayName,
    profile_image_url: options.profileImageUrl,
    client_metadata: options.clientMetadata,
    client_read_only_metadata: options.clientReadOnlyMetadata,
    server_metadata: options.serverMetadata,
  };
}
