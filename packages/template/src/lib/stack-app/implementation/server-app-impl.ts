import { KnownErrors, StackServerInterface } from "@stackframe/stack-shared";
import { InternalSession } from "@stackframe/stack-shared/dist/sessions";
import { Result } from "@stackframe/stack-shared/dist/utils/results";
import { UsersCrud, TeamsCrud, TeamPermissionsCrud, TeamMemberProfilesCrud, TeamInvitationCrud } from "@stackframe/stack-shared/dist/interface/crud";
import { ProviderType } from "@stackframe/stack-shared/dist/utils/oauth";

import { 
  StackServerApp, 
  StackServerAppConstructorOptions,
  ServerUserCreateOptions,
  ServerTeamCreateOptions,
  ServerListUsersOptions,
  ServerUser,
  ServerTeam
} from "../interface/server-app";

import {
  HandlerUrls,
  OAuthScopesOnSignIn,
  OAuthConnection
} from "../interface/client-app";

import { _StackClientAppImpl } from "./client-app-impl";
import { createCache, createCacheBySession } from "./helpers/index";

// IF_PLATFORM react-like
import { useAsyncCache } from "./helpers/react";
// END_PLATFORM

// Export the implementation class
export class _StackServerAppImpl<HasTokenStore extends boolean, ProjectId extends string> extends _StackClientAppImpl<HasTokenStore, ProjectId> {
  declare protected _interface: StackServerInterface;

  // TODO override the client user cache to use the server user cache, so we save some requests
  private readonly _currentServerUserCache = createCacheBySession(async (session) => {
    if (session.isKnownToBeInvalid()) {
      // see comment in _currentUserCache for more details on why we do this
      return null;
    }
    return await this._interface.getServerUserByToken(session);
  });
  private readonly _serverUsersCache = createCache<[
    cursor?: string,
    limit?: number,
    orderBy?: 'signedUpAt',
    desc?: boolean,
    query?: string,
  ], UsersCrud['Server']['List']>(async ([cursor, limit, orderBy, desc, query]) => {
    return await this._interface.listServerUsers({ cursor, limit, orderBy, desc, query });
  });
  private readonly _serverUserCache = createCache<string[], UsersCrud['Server']['Read'] | null>(async ([userId]) => {
    const user = await this._interface.getServerUserById(userId);
    return Result.or(user, null);
  });
  private readonly _serverTeamsCache = createCache<[string | undefined], TeamsCrud['Server']['Read'][]>(async ([userId]) => {
    return await this._interface.listServerTeams({ userId });
  });
  private readonly _serverTeamUserPermissionsCache = createCache<
    [string, string, boolean],
    TeamPermissionsCrud['Server']['Read'][]
  >(async ([teamId, userId, recursive]) => {
    return await this._interface.listServerTeamPermissions({ teamId, userId, recursive }, null);
  });
  private readonly _serverUserOAuthConnectionAccessTokensCache = createCache<[string, string, string], { accessToken: string } | null>(
    async ([userId, providerId, scope]) => {
      try {
        const result = await this._interface.createServerProviderAccessToken(userId, providerId, scope || "");
        return { accessToken: result.access_token };
      } catch (err) {
        if (!(err instanceof KnownErrors.OAuthConnectionDoesNotHaveRequiredScope || err instanceof KnownErrors.OAuthConnectionNotConnectedToUser)) {
          throw err;
        }
      }
      return null;
    }
  );
  private readonly _serverUserOAuthConnectionCache = createCache<[string, ProviderType, string, boolean], OAuthConnection | null>(
    async ([userId, providerId, scope, redirect]) => {
      return await this._getUserOAuthConnectionCacheFn({
        getUser: async () => Result.orThrow(await this._serverUserCache.getOrWait([userId], "write-only")),
        getOrWaitOAuthToken: async () => Result.orThrow(await this._serverUserOAuthConnectionAccessTokensCache.getOrWait([userId, providerId, scope || ""] as const, "write-only")),
        // IF_PLATFORM react-like
        useOAuthToken: () => useAsyncCache(this._serverUserOAuthConnectionAccessTokensCache, [userId, providerId, scope || ""] as const, "user.useConnectedAccount()"),
        // END_PLATFORM
        providerId,
        scope,
        redirect,
        session: null,
      });
    }
  );
  private readonly _serverTeamMemberProfilesCache = createCache<[string], TeamMemberProfilesCrud['Server']['Read'][]>(
    async ([teamId]) => {
      return await this._interface.listServerTeamMemberProfiles({ teamId });
    }
  );
  private readonly _serverTeamInvitationsCache = createCache<[string], TeamInvitationCrud['Server']['Read'][]>(
    async ([teamId]) => {
      return await this._interface.listServerTeamInvitations({ teamId });
    }
  );

  constructor(options: StackServerAppConstructorOptions<HasTokenStore, ProjectId>) {
    super({
      ...options,
      interface: options.interface ?? new StackServerInterface({
        getBaseUrl: () => getBaseUrl(options.baseUrl),
        projectId: options.projectId ?? getDefaultProjectId(),
        clientVersion,
        secretServerKey: options.secretServerKey ?? getDefaultSecretServerKey(),
      }),
    });
  }

  protected _serverUserFromCrud(crud: UsersCrud['Server']['Read']): ServerUser {
    const baseUser = this._createBaseUser(crud);
    const app = this;
    return {
      ...baseUser,
      async update(update) {
        await app._interface.updateServerUser(crud.id, {
          display_name: update.displayName,
          client_metadata: update.clientMetadata,
          server_metadata: update.serverMetadata,
          client_read_only_metadata: update.clientReadOnlyMetadata,
          selected_team_id: update.selectedTeamId,
          requires_totp_mfa: update.isMultiFactorRequired,
        });
        await app._serverUserCache.refresh([crud.id]);
      },
      async delete() {
        await app._interface.deleteServerUser(crud.id);
        await app._serverUserCache.refresh([crud.id]);
      },
      async getConnectedAccount(id, options) {
        const scopeString = options?.scopes?.join(" ");
        return Result.orThrow(await app._serverUserOAuthConnectionCache.getOrWait([crud.id, id, scopeString || "", options?.or === 'redirect'], "write-only"));
      },
      // IF_PLATFORM react-like
      useConnectedAccount(id, options) {
        const scopeString = options?.scopes?.join(" ");
        return useAsyncCache(app._serverUserOAuthConnectionCache, [crud.id, id, scopeString || "", options?.or === 'redirect'] as const, "user.useConnectedAccount()");
      },
      // END_PLATFORM
      async getTeam(teamId) {
        const teams = await this.listTeams();
        return teams.find((t) => t.id === teamId) ?? null;
      },
      // IF_PLATFORM react-like
      useTeam(teamId) {
        const teams = this.useTeams();
        return useMemo(() => {
          return teams.find((t) => t.id === teamId) ?? null;
        }, [teams, teamId]);
      },
      // END_PLATFORM
      async listTeams() {
        const teams = Result.orThrow(await app._serverTeamsCache.getOrWait([crud.id], "write-only"));
        return teams.map((crud) => app._serverTeamFromCrud(crud));
      },
      // IF_PLATFORM react-like
      useTeams() {
        const teams = useAsyncCache(app._serverTeamsCache, [crud.id], "user.useTeams()");
        return useMemo(() => teams.map((crud) => app._serverTeamFromCrud(crud)), [teams]);
      },
      // END_PLATFORM
      async listPermissions(scope, options) {
        const recursive = options?.recursive ?? true;
        const permissions = Result.orThrow(await app._serverTeamUserPermissionsCache.getOrWait([scope.id, crud.id, recursive], "write-only"));
        return permissions.map((crud) => app._clientTeamPermissionFromCrud(crud));
      },
      // IF_PLATFORM react-like
      usePermissions(scope, options) {
        const recursive = options?.recursive ?? true;
        const permissions = useAsyncCache(app._serverTeamUserPermissionsCache, [scope.id, crud.id, recursive] as const, "user.usePermissions()");
        return useMemo(() => permissions.map((crud) => app._clientTeamPermissionFromCrud(crud)), [permissions]);
      },
      // END_PLATFORM
      // IF_PLATFORM react-like
      usePermission(scope, permissionId) {
        const permissions = this.usePermissions(scope);
        return useMemo(() => permissions.find((p) => p.id === permissionId) ?? null, [permissions, permissionId]);
      },
      // END_PLATFORM
      async getPermission(scope, permissionId) {
        const permissions = await this.listPermissions(scope);
        return permissions.find((p) => p.id === permissionId) ?? null;
      },
      async hasPermission(scope, permissionId) {
        return (await this.getPermission(scope, permissionId)) !== null;
      },
      serverMetadata: crud.server_metadata,
    };
  }

  protected _serverTeamFromCrud(crud: TeamsCrud['Server']['Read']): ServerTeam {
    const app = this;
    return {
      id: crud.id,
      displayName: crud.display_name,
      profileImageUrl: crud.profile_image_url,
      clientMetadata: crud.client_metadata,
      clientReadOnlyMetadata: crud.client_read_only_metadata,
      serverMetadata: crud.server_metadata,
      async listUsers() {
        const result = Result.orThrow(await app._serverTeamMemberProfilesCache.getOrWait([crud.id], "write-only"));
        return result.map((crud) => app._clientTeamUserFromCrud(crud));
      },
      // IF_PLATFORM react-like
      useUsers() {
        const result = useAsyncCache(app._serverTeamMemberProfilesCache, [crud.id] as const, "team.useUsers()");
        return result.map((crud) => app._clientTeamUserFromCrud(crud));
      },
      // END_PLATFORM
      async listInvitations() {
        const result = Result.orThrow(await app._serverTeamInvitationsCache.getOrWait([crud.id], "write-only"));
        return result.map((crud) => ({
          id: crud.id,
          recipientEmail: crud.recipient_email,
          expiresAt: new Date(crud.expires_at_millis),
          revoke: async () => {
            await app._interface.revokeServerTeamInvitation(crud.id, crud.team_id);
            await app._serverTeamInvitationsCache.refresh([crud.id]);
          },
        }));
      },
      // IF_PLATFORM react-like
      useInvitations() {
        const result = useAsyncCache(app._serverTeamInvitationsCache, [crud.id] as const, "team.useInvitations()");
        return result.map((crud) => ({
          id: crud.id,
          recipientEmail: crud.recipient_email,
          expiresAt: new Date(crud.expires_at_millis),
          revoke: async () => {
            await app._interface.revokeServerTeamInvitation(crud.id, crud.team_id);
            await app._serverTeamInvitationsCache.refresh([crud.id]);
          },
        }));
      },
      // END_PLATFORM
      async inviteUser(options) {
        await app._interface.sendServerTeamInvitation({
          teamId: crud.id,
          email: options.email,
          callbackUrl: options.callbackUrl ?? constructRedirectUrl(app.urls.teamInvitation),
        });
        await app._serverTeamInvitationsCache.refresh([crud.id]);
      },
      async update(data) {
        await app._interface.updateServerTeam({ data: teamUpdateOptionsToCrud(data), teamId: crud.id });
        await app._serverTeamsCache.refresh([undefined]);
      },
      async delete() {
        await app._interface.deleteServerTeam(crud.id);
        await app._serverTeamsCache.refresh([undefined]);
      },
    };
  }

  async createUser(options: ServerUserCreateOptions): Promise<ServerUser> {
    const crud = await this._interface.createServerUser({
      email: options.email,
      password: options.password,
      display_name: options.displayName,
      client_metadata: options.clientMetadata,
      server_metadata: options.serverMetadata,
      client_read_only_metadata: options.clientReadOnlyMetadata,
      requires_totp_mfa: options.isMultiFactorRequired,
    });
    await this._serverUserCache.refresh([crud.id]);
    return this._serverUserFromCrud(crud);
  }

  async createTeam(options: ServerTeamCreateOptions): Promise<ServerTeam> {
    const crud = await this._interface.createServerTeam(teamCreateOptionsToCrud(options, options.userId));
    await this._serverTeamsCache.refresh([undefined]);
    return this._serverTeamFromCrud(crud);
  }

  async getUser(userId: string): Promise<ServerUser | null> {
    const crud = Result.orThrow(await this._serverUserCache.getOrWait([userId], "write-only"));
    if (!crud) return null;
    return this._serverUserFromCrud(crud);
  }

  async listUsers(options?: ServerListUsersOptions): Promise<{ users: ServerUser[], cursor: string | null }> {
    const { cursor, limit, orderBy, desc, query } = options ?? {};
    const result = Result.orThrow(await this._serverUsersCache.getOrWait([cursor, limit, orderBy, desc, query], "write-only"));
    return {
      users: result.users.map((crud) => this._serverUserFromCrud(crud)),
      cursor: result.cursor,
    };
  }

  async getCurrentUser(): Promise<ServerUser | null> {
    const session = await this._getSession();
    const crud = Result.orThrow(await this._currentServerUserCache.getOrWait([session], "write-only"));
    if (!crud) return null;
    return this._serverUserFromCrud(crud);
  }

  // IF_PLATFORM react-like
  useCurrentUser(): ServerUser | null {
    const session = this._useSession();
    const crud = useAsyncCache(this._currentServerUserCache, [session], "useCurrentUser()");
    if (!crud) return null;
    return this._serverUserFromCrud(crud);
  }
  // END_PLATFORM
}

// Import from helpers
import { getBaseUrl, getDefaultProjectId, getDefaultSecretServerKey } from "./helpers/utils";
import { teamCreateOptionsToCrud, teamUpdateOptionsToCrud } from "../../utils/crud";
import { constructRedirectUrl } from "@stackframe/stack-shared/dist/utils/urls";

// IF_PLATFORM react-like
import { useMemo } from "react";
// END_PLATFORM

// Global variables
const clientVersion = "0.0.0-dev";
