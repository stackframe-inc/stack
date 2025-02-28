import { AdminProjectUpdateOptions, StackAdminApp } from '@stackframe/js';
import { wait } from '@stackframe/stack-shared/dist/utils/promises';
import { STACK_BACKEND_BASE_URL, STACK_INTERNAL_PROJECT_ADMIN_KEY, STACK_INTERNAL_PROJECT_CLIENT_KEY, STACK_INTERNAL_PROJECT_SERVER_KEY } from '../helpers';
import { ApiKey, Project, niceBackendFetch } from '../backend/backend-helpers';

export async function scaffoldProject(body?: AdminProjectUpdateOptions & { teamsEnabled?: boolean }) {
  // Don't pass config to backend - use default config
  const backendConfig = undefined;

  // Create a project and get admin token using backend helpers
  const { projectId, adminAccessToken } = await Project.createAndGetAdminToken({
    display_name: body?.displayName || 'New Project',
    config: backendConfig,
  });

  // For team management tests, enable teams after project creation
  if (body?.teamsEnabled) {
    await Project.updateCurrent(adminAccessToken, {
      config: {
        client_team_creation_enabled: true,
        create_team_on_sign_up: true,
      }
    });
  }

  console.log('Project created with ID:', projectId);
  console.log('Admin access token obtained');

  // Create API keys for the project using the admin access token
  const { createApiKeyResponse } = await ApiKey.create(adminAccessToken, {
    description: "Test API Key",
    has_publishable_client_key: true,
    has_secret_server_key: true,
    has_super_secret_admin_key: true,
  });

  console.log('API keys created successfully');

  // Extract the keys from the response
  const publishableClientKey = createApiKeyResponse.body.publishable_client_key;
  const secretServerKey = createApiKeyResponse.body.secret_server_key;
  const superSecretAdminKey = createApiKeyResponse.body.super_secret_admin_key;

  console.log('Using publishable client key:', publishableClientKey);

  // Get project details
  const projectResponse = await niceBackendFetch(`/api/v1/projects/current`, {
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken,
    }
  });

  const project = {
    id: projectId,
    displayName: projectResponse.body.display_name,
    config: projectResponse.body.config,
    publishableClientKey: publishableClientKey,
    secretServerKey: secretServerKey,
    superSecretAdminKey: superSecretAdminKey,
  };

  // Create a user for the project
  const internalApp = new StackAdminApp({
    projectId: projectId,
    baseUrl: STACK_BACKEND_BASE_URL,
    publishableClientKey: publishableClientKey,
    secretServerKey: secretServerKey,
    superSecretAdminKey: superSecretAdminKey,
    tokenStore: "memory",
    urls: {
      emailVerification: "https://stack-js-test.example.com/verify"
    }
  });

  return {
    project,
    adminAccessToken,
    app: internalApp,
  };
}
