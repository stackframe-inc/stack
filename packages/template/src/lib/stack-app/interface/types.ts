import { ProviderType } from "@stackframe/stack-shared/dist/utils/oauth";

// Server team types
export type ServerTeam = {
  id: string,
  displayName: string,
  clientMetadata: Record<string, unknown> | null,
  serverMetadata: Record<string, unknown> | null,
  createdAt: string,
  inviteUser(email: string): Promise<void>,
  listUsers(): Promise<any[]>,
  // NEXT_LINE_PLATFORM react-like
  useUsers(): any[],
  listInvitations(): Promise<any[]>,
  // NEXT_LINE_PLATFORM react-like
  useInvitations(): any[],
  update(data: any): Promise<void>,
  delete(): Promise<void>,
};

// User types
export type BaseUser = {
  id: string,
  email: string,
  emailVerified: boolean,
  displayName: string | null,
  createdAt: string,
  clientMetadata: Record<string, unknown> | null,
};

export type Auth = {
  auth: {
    getTokens(): Promise<{ accessToken: string, refreshToken: string }>,
    getAuthHeaders(): { Authorization: string },
    getAuthJson(): { accessToken: string, refreshToken: string },
    registerPasskey(): Promise<void>,
    signOut(): Promise<void>,
  },
};

export type UserExtra = {
  getConnectedAccount(id: ProviderType, options?: { scopes?: string[] }): Promise<any | null>,
  getConnectedAccount(id: ProviderType, options: { or: 'redirect', scopes?: string[] }): Promise<any>,
  // NEXT_LINE_PLATFORM react-like
  useConnectedAccount(id: ProviderType, options?: { scopes?: string[] }): any | null,
  // NEXT_LINE_PLATFORM react-like
  useConnectedAccount(id: ProviderType, options: { or: 'redirect', scopes?: string[] }): any,
  setDisplayName(displayName: string): Promise<void>,
  setClientMetadata(metadata: Record<string, unknown>): Promise<void>,
  setSelectedTeam(teamId: string | null): Promise<void>,
  getTeam(id: string): Promise<any | null>,
  // NEXT_LINE_PLATFORM react-like
  useTeam(id: string): any | null,
  listTeams(): Promise<any[]>,
  // NEXT_LINE_PLATFORM react-like
  useTeams(): any[],
  createTeam(data: any): Promise<any>,
  leaveTeam(teamId: string): Promise<void>,
  listPermissions(options: { teamId: string, recursive?: boolean }): Promise<any[]>,
  // NEXT_LINE_PLATFORM react-like
  usePermissions(options: { teamId: string, recursive?: boolean }): any[],
  // NEXT_LINE_PLATFORM react-like
  usePermission(options: { teamId: string, permissionId: string, recursive?: boolean }): any | null,
  getPermission(options: { teamId: string, permissionId: string, recursive?: boolean }): Promise<any | null>,
  hasPermission(options: { teamId: string, permissionId: string, recursive?: boolean }): Promise<boolean>,
  update(options: any): Promise<void>,
  sendVerificationEmail(options?: { callbackUrl?: string }): Promise<void>,
};

export type InternalUserExtra = {
  listOwnedProjects(): Promise<any[]>,
  // NEXT_LINE_PLATFORM react-like
  useOwnedProjects(): any[],
};

export type User = BaseUser;
export type CurrentUser = BaseUser & Auth & UserExtra;
export type CurrentInternalUser = CurrentUser & InternalUserExtra;

// Server user types
export type ServerBaseUser = {
  teamPermissions: any[],
  serverMetadata: Record<string, unknown> | null,
};

export type ServerUser = ServerBaseUser & BaseUser & UserExtra;
export type CurrentServerUser = Auth & ServerUser;
export type CurrentInternalServerUser = CurrentServerUser & InternalUserExtra;

// Project types
export type Project = {
  id: string,
  displayName: string,
  clientMetadata: Record<string, unknown> | null,
};

export type AdminProject = {
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
