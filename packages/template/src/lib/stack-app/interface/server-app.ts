import { KnownErrors } from "@stackframe/stack-shared";
import { Result } from "@stackframe/stack-shared/dist/utils/results";

import { AsyncStoreProperty } from "./common";
import { ServerUser, CurrentServerUser, ServerTeam } from "./types";
import { GetUserOptions, StackClientApp, StackClientAppConstructorOptions } from "./client-app";

// Server-specific types
export type ServerUserCreateOptions = {
  email: string,
  password?: string,
  displayName?: string,
  emailVerified?: boolean,
  serverMetadata?: Record<string, unknown>,
  clientMetadata?: Record<string, unknown>,
  clientReadOnlyMetadata?: Record<string, unknown>,
  requiresMultiFactor?: boolean,
};

export type ServerTeamCreateOptions = {
  displayName: string,
  serverMetadata?: Record<string, unknown>,
  clientMetadata?: Record<string, unknown>,
};

export type ServerListUsersOptions = {
  cursor?: string,
  limit?: number,
};

export type ProjectCurrentServerUser<ProjectId> = ProjectId extends "internal" ? CurrentInternalServerUser : CurrentServerUser;

export type CurrentInternalServerUser = CurrentServerUser & {
  listOwnedProjects(): Promise<AdminProject[]>,
  // NEXT_LINE_PLATFORM react-like
  useOwnedProjects(): AdminProject[],
};

// Define AdminProject here to avoid circular dependency
type AdminProject = {
  id: string,
  displayName: string,
  clientMetadata: Record<string, unknown> | null,
  serverMetadata: Record<string, unknown> | null,
  emailConfig: {
    host: string | null,
    port: number | null,
    username: string | null,
    password: string | null,
    senderEmail: string | null,
    senderName: string | null,
  } | null,
  oauthProviders: Record<string, any>,
  redirectUrls: string[],
  emailTemplates: any[],
};

export type StackServerAppConstructorOptions<HasTokenStore extends boolean, ProjectId extends string> = {
  secretServerKey?: string,
} & StackClientAppConstructorOptions<HasTokenStore, ProjectId>;

export type StackServerApp<HasTokenStore extends boolean = boolean, ProjectId extends string = string> = (
  & {
    createTeam(data: ServerTeamCreateOptions): Promise<any>,
    /**
     * @deprecated use `getUser()` instead
     */
    getServerUser(): Promise<ProjectCurrentServerUser<ProjectId> | null>,

    createUser(options: ServerUserCreateOptions): Promise<ServerUser>,

    // IF_PLATFORM react-like
    useUser(options: GetUserOptions<HasTokenStore> & { or: 'redirect' }): ProjectCurrentServerUser<ProjectId>,
    useUser(options: GetUserOptions<HasTokenStore> & { or: 'throw' }): ProjectCurrentServerUser<ProjectId>,
    useUser(options?: GetUserOptions<HasTokenStore>): ProjectCurrentServerUser<ProjectId> | null,
    // END_PLATFORM

    getUser(options: GetUserOptions<HasTokenStore> & { or: 'redirect' }): Promise<ProjectCurrentServerUser<ProjectId>>,
    getUser(options: GetUserOptions<HasTokenStore> & { or: 'throw' }): Promise<ProjectCurrentServerUser<ProjectId>>,
    getUser(options?: GetUserOptions<HasTokenStore>): Promise<ProjectCurrentServerUser<ProjectId> | null>,

    // NEXT_LINE_PLATFORM react-like
    useUsers(options?: ServerListUsersOptions): ServerUser[] & { nextCursor: string | null },
    listUsers(options?: ServerListUsersOptions): Promise<ServerUser[] & { nextCursor: string | null }>,
  }
  & AsyncStoreProperty<"user", [id: string], ServerUser | null, false>
  & Omit<AsyncStoreProperty<"users", [], ServerUser[], true>, "listUsers" | "useUsers">
  & AsyncStoreProperty<"team", [id: string], any | null, false>
  & AsyncStoreProperty<"teams", [], any[], true>
  & StackClientApp<HasTokenStore, ProjectId>
);

export type StackServerAppConstructor = {
  new <
    TokenStoreType extends string,
    HasTokenStore extends (TokenStoreType extends {} ? true : boolean),
    ProjectId extends string
  >(options: StackServerAppConstructorOptions<HasTokenStore, ProjectId>): StackServerApp<HasTokenStore, ProjectId>,
  new (options: StackServerAppConstructorOptions<boolean, string>): StackServerApp<boolean, string>,
};

// No need to import this again as it's already imported above
