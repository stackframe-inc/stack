import { Result } from "@stackframe/stack-shared/dist/utils/results";

// Define EmailTemplateType here to avoid import issues
type EmailTemplateType = 
  | "welcome"
  | "password-reset"
  | "email-verification"
  | "magic-link"
  | "team-invitation";

import { AsyncStoreProperty } from "./common";
import { EmailConfig } from "./common";
import { StackServerApp } from "./server-app";
import { StackServerAppConstructorOptions } from "./server-app";

// Admin-specific types
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

export type AdminProjectUpdateOptions = {
  displayName?: string,
  clientMetadata?: Record<string, unknown>,
  serverMetadata?: Record<string, unknown>,
  emailConfig?: {
    host?: string | null,
    port?: number | null,
    username?: string | null,
    password?: string | null,
    senderEmail?: string | null,
    senderName?: string | null,
  } | null,
  redirectUrls?: string[],
};

export type AdminProjectCreateOptions = {
  displayName: string,
  clientMetadata?: Record<string, unknown>,
  serverMetadata?: Record<string, unknown>,
};

export type AdminEmailTemplate = {
  type: EmailTemplateType,
  subject: string,
  content: any,
  isDefault: boolean,
}

export type AdminEmailTemplateUpdateOptions = {
  subject?: string,
  content?: any,
};

export type ApiKey = {
  id: string,
  name: string,
  createdAt: string,
  expiresAt: string | null,
  lastUsedAt: string | null,
  prefix: string,
};

export type ApiKeyCreateOptions = {
  name: string,
  expiresAt?: string | null,
};

export type ApiKeyFirstView = ApiKey & {
  key: string,
};

export type AdminTeamPermissionDefinition = {
  id: string,
  displayName: string,
  description: string | null,
  createdAt: string,
};

export type AdminTeamPermission = AdminTeamPermissionDefinition;

export type AdminTeamPermissionDefinitionCreateOptions = {
  displayName: string,
  description?: string | null,
};

export type AdminTeamPermissionDefinitionUpdateOptions = {
  displayName?: string,
  description?: string | null,
};

export type StackAdminAppConstructorOptions<HasTokenStore extends boolean, ProjectId extends string> = {
  superSecretAdminKey?: string,
} & StackServerAppConstructorOptions<HasTokenStore, ProjectId>;

export type StackAdminApp<HasTokenStore extends boolean = boolean, ProjectId extends string = string> = (
  & AsyncStoreProperty<"project", [], AdminProject, false>
  & AsyncStoreProperty<"apiKeys", [], ApiKey[], true>
  & AsyncStoreProperty<"teamPermissionDefinitions", [], AdminTeamPermissionDefinition[], true>
  & {
    // NEXT_LINE_PLATFORM react-like
    useEmailTemplates(): AdminEmailTemplate[],
    listEmailTemplates(): Promise<AdminEmailTemplate[]>,
    updateEmailTemplate(type: EmailTemplateType, data: AdminEmailTemplateUpdateOptions): Promise<void>,
    resetEmailTemplate(type: EmailTemplateType): Promise<void>,

    createApiKey(options: ApiKeyCreateOptions): Promise<ApiKeyFirstView>,

    createTeamPermissionDefinition(data: AdminTeamPermissionDefinitionCreateOptions): Promise<AdminTeamPermission>,
    updateTeamPermissionDefinition(permissionId: string, data: AdminTeamPermissionDefinitionUpdateOptions): Promise<void>,
    deleteTeamPermissionDefinition(permissionId: string): Promise<void>,

    // NEXT_LINE_PLATFORM react-like
    useSvixToken(): string,

    sendTestEmail(options: {
      recipientEmail: string,
      emailConfig: EmailConfig,
    }): Promise<Result<undefined, { errorMessage: string }>>,
  }
  & StackServerApp<HasTokenStore, ProjectId>
);

export type StackAdminAppConstructor = {
  new <
    HasTokenStore extends boolean,
    ProjectId extends string
  >(options: StackAdminAppConstructorOptions<HasTokenStore, ProjectId>): StackAdminApp<HasTokenStore, ProjectId>,
  new (options: StackAdminAppConstructorOptions<boolean, string>): StackAdminApp<boolean, string>,
};
