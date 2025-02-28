// Re-export the symbol
export { stackAppInternalsSymbol } from './symbols';

// Import types from interface files
import { TeamCreateOptions, TeamUpdateOptions } from '../../interface/client-app';
import { ServerUserCreateOptions } from '../../interface/server-app';

// Re-export imported types
export { TeamCreateOptions, TeamUpdateOptions, ServerUserCreateOptions };

// Export interface for API keys
export interface ApiKey {
  id: string;
  name: string;
  createdAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  prefix: string;
}

// Export interface for Admin Project
export interface AdminProject {
  id: string;
  displayName: string;
  clientMetadata: Record<string, unknown> | null;
  serverMetadata: Record<string, unknown> | null;
  emailConfig: {
    host: string | null;
    port: number | null;
    username: string | null;
    password: string | null;
    senderEmail: string | null;
    senderName: string | null;
  } | null;
  oauthProviders: Record<string, any>;
  redirectUrls: string[];
  emailTemplates: any[];
  update(options: any): Promise<void>;
}
