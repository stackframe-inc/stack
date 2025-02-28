import { KnownErrors, StackAdminInterface } from "@stackframe/stack-shared";
import { InternalSession } from "@stackframe/stack-shared/dist/sessions";
import { Result } from "@stackframe/stack-shared/dist/utils/results";
import { InternalProjectsCrud, ApiKeysCrud } from "@stackframe/stack-shared/dist/interface/crud";
import { EmailTemplateType } from "@stackframe/stack-shared/dist/interface/crud/email-templates";
import { StackAssertionError } from "@stackframe/stack-shared/dist/utils/errors";

import { 
  StackAdminApp, 
  StackAdminAppConstructorOptions,
  AdminProject,
  AdminProjectUpdateOptions,
  AdminProjectCreateOptions,
  AdminEmailTemplate,
  AdminEmailTemplateUpdateOptions,
  ApiKey,
  ApiKeyCreateOptions,
  ApiKeyFirstView,
  AdminTeamPermissionDefinition,
  AdminTeamPermissionDefinitionCreateOptions,
  AdminTeamPermissionDefinitionUpdateOptions
} from "../interface/admin-app";

import { _StackServerAppImpl } from "./server-app-impl";
import { createCache } from "./helpers/index";

// IF_PLATFORM react-like
import { useAsyncCache } from "./helpers/react";
// END_PLATFORM

// Export the implementation class
export class _StackAdminAppImpl<HasTokenStore extends boolean, ProjectId extends string> extends _StackServerAppImpl<HasTokenStore, ProjectId> {
  declare protected _interface: StackAdminInterface;

  private readonly _adminProjectCache = createCache(async () => {
    return await this._interface.getProject();
  });
  private readonly _apiKeysCache = createCache(async () => {
    return await this._interface.listApiKeys();
  });
  private readonly _adminEmailTemplatesCache = createCache(async () => {
    return await this._interface.listEmailTemplates();
  });
  private readonly _adminTeamPermissionDefinitionsCache = createCache(async () => {
    return await this._interface.listPermissionDefinitions();
  });
  private readonly _svixTokenCache = createCache(async () => {
    return await this._interface.getSvixToken();
  });
  private readonly _metricsCache = createCache(async () => {
    return await this._interface.getMetrics();
  });

  constructor(options: StackAdminAppConstructorOptions<HasTokenStore, ProjectId>) {
    super({
      interface: new StackAdminInterface({
        getBaseUrl: () => getBaseUrl(options.baseUrl),
        projectId: options.projectId ?? getDefaultProjectId(),
        clientVersion,
        ..."projectOwnerSession" in options ? {
          projectOwnerSession: options.projectOwnerSession,
        } : {
          publishableClientKey: options.publishableClientKey ?? getDefaultPublishableClientKey(),
          secretServerKey: options.secretServerKey ?? getDefaultSecretServerKey(),
          superSecretAdminKey: options.superSecretAdminKey ?? getDefaultSuperSecretAdminKey(),
        },
      }),
      baseUrl: options.baseUrl,
      projectId: options.projectId,
      tokenStore: options.tokenStore,
      urls: options.urls,
      oauthScopesOnSignIn: options.oauthScopesOnSignIn,
      redirectMethod: options.redirectMethod,
    });
  }

  _adminOwnedProjectFromCrud(data: InternalProjectsCrud['Admin']['Read'], onRefresh: () => Promise<void>): AdminOwnedProject {
    if (this._tokenStoreInit !== null) {
      throw new StackAssertionError("Owned apps must always have tokenStore === null — did you not create this project with app._createOwnedApp()?");
    }
    return {
      ...this._adminProjectFromCrud(data, onRefresh),
      app: this as StackAdminApp<false>,
    };
  }

  _adminProjectFromCrud(data: InternalProjectsCrud['Admin']['Read'], onRefresh: () => Promise<void>): AdminProject {
    const app = this;
    return {
      id: data.id,
      displayName: data.display_name,
      clientMetadata: data.client_metadata,
      serverMetadata: data.server_metadata,
      emailConfig: data.email_config,
      oauthProviders: data.oauth_providers,
      redirectUrls: data.redirect_urls,
      emailTemplates: data.email_templates,
      async update(options: AdminProjectUpdateOptions) {
        await app._interface.updateProject({
          display_name: options.displayName,
          client_metadata: options.clientMetadata,
          server_metadata: options.serverMetadata,
          email_config: options.emailConfig,
          redirect_urls: options.redirectUrls,
        });
        await onRefresh();
      },
    };
  }

  async getProject(): Promise<AdminProject> {
    const data = Result.orThrow(await this._adminProjectCache.getOrWait([], "write-only"));
    return this._adminProjectFromCrud(data, () => this._adminProjectCache.refresh([]));
  }

  // IF_PLATFORM react-like
  useProject(): AdminProject {
    const data = useAsyncCache(this._adminProjectCache, [], "useProject()");
    return this._adminProjectFromCrud(data, () => this._adminProjectCache.refresh([]));
  }
  // END_PLATFORM

  async listApiKeys(): Promise<ApiKey[]> {
    const data = Result.orThrow(await this._apiKeysCache.getOrWait([], "write-only"));
    return data.map((key) => ({
      id: key.id,
      name: key.name,
      createdAt: key.created_at,
      expiresAt: key.expires_at,
      lastUsedAt: key.last_used_at,
      prefix: key.prefix,
    }));
  }

  // IF_PLATFORM react-like
  useApiKeys(): ApiKey[] {
    const data = useAsyncCache(this._apiKeysCache, [], "useApiKeys()");
    return data.map((key) => ({
      id: key.id,
      name: key.name,
      createdAt: key.created_at,
      expiresAt: key.expires_at,
      lastUsedAt: key.last_used_at,
      prefix: key.prefix,
    }));
  }
  // END_PLATFORM

  async createApiKey(options: ApiKeyCreateOptions): Promise<ApiKeyFirstView> {
    const data = await this._interface.createApiKey({
      name: options.name,
      expires_at: options.expiresAt,
    });
    await this._apiKeysCache.refresh([]);
    return {
      id: data.id,
      name: data.name,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      lastUsedAt: data.last_used_at,
      prefix: data.prefix,
      key: data.key,
    };
  }

  async listEmailTemplates(): Promise<AdminEmailTemplate[]> {
    const data = Result.orThrow(await this._adminEmailTemplatesCache.getOrWait([], "write-only"));
    return data.map((template) => ({
      type: template.type as EmailTemplateType,
      subject: template.subject,
      content: template.content,
      isDefault: template.is_default,
    }));
  }

  // IF_PLATFORM react-like
  useEmailTemplates(): AdminEmailTemplate[] {
    const data = useAsyncCache(this._adminEmailTemplatesCache, [], "useEmailTemplates()");
    return data.map((template) => ({
      type: template.type as EmailTemplateType,
      subject: template.subject,
      content: template.content,
      isDefault: template.is_default,
    }));
  }
  // END_PLATFORM

  async updateEmailTemplate(type: EmailTemplateType, data: AdminEmailTemplateUpdateOptions): Promise<void> {
    await this._interface.updateEmailTemplate(type, {
      subject: data.subject,
      content: data.content,
    });
    await this._adminEmailTemplatesCache.refresh([]);
  }

  async resetEmailTemplate(type: EmailTemplateType): Promise<void> {
    await this._interface.resetEmailTemplate(type);
    await this._adminEmailTemplatesCache.refresh([]);
  }

  async listTeamPermissionDefinitions(): Promise<AdminTeamPermissionDefinition[]> {
    const data = Result.orThrow(await this._adminTeamPermissionDefinitionsCache.getOrWait([], "write-only"));
    return data.map((permission) => ({
      id: permission.id,
      displayName: permission.display_name,
      description: permission.description,
      createdAt: permission.created_at,
    }));
  }

  // IF_PLATFORM react-like
  useTeamPermissionDefinitions(): AdminTeamPermissionDefinition[] {
    const data = useAsyncCache(this._adminTeamPermissionDefinitionsCache, [], "useTeamPermissionDefinitions()");
    return data.map((permission) => ({
      id: permission.id,
      displayName: permission.display_name,
      description: permission.description,
      createdAt: permission.created_at,
    }));
  }
  // END_PLATFORM

  async createTeamPermissionDefinition(data: AdminTeamPermissionDefinitionCreateOptions): Promise<AdminTeamPermissionDefinition> {
    const result = await this._interface.createPermissionDefinition({
      display_name: data.displayName,
      description: data.description,
    });
    await this._adminTeamPermissionDefinitionsCache.refresh([]);
    return {
      id: result.id,
      displayName: result.display_name,
      description: result.description,
      createdAt: result.created_at,
    };
  }

  async updateTeamPermissionDefinition(permissionId: string, data: AdminTeamPermissionDefinitionUpdateOptions): Promise<void> {
    await this._interface.updatePermissionDefinition(permissionId, {
      display_name: data.displayName,
      description: data.description,
    });
    await this._adminTeamPermissionDefinitionsCache.refresh([]);
  }

  async deleteTeamPermissionDefinition(permissionId: string): Promise<void> {
    await this._interface.deletePermissionDefinition(permissionId);
    await this._adminTeamPermissionDefinitionsCache.refresh([]);
  }

  // IF_PLATFORM react-like
  useSvixToken(): string {
    return useAsyncCache(this._svixTokenCache, [], "useSvixToken()");
  }
  // END_PLATFORM

  async sendTestEmail(options: {
    recipientEmail: string,
    emailConfig: EmailConfig,
  }): Promise<Result<undefined, { errorMessage: string }>> {
    return await this._interface.sendTestEmail(options);
  }
}

// Import from helpers
import { getBaseUrl, getDefaultProjectId, getDefaultPublishableClientKey, getDefaultSecretServerKey, getDefaultSuperSecretAdminKey } from "./helpers/utils";
import { EmailConfig } from "../interface/common";

// Additional types
type AdminOwnedProject = AdminProject & {
  app: StackAdminApp<false>,
};

// Global variables
const clientVersion = "0.0.0-dev";
