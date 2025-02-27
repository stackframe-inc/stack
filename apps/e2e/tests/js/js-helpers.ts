import { StackAdminApp } from '@stackframe/js';

export async function scaffoldProject() {
  const adminApp = new StackAdminApp({
    projectId: "internal",
    publishableClientKey: "your-publishable-client-key-from-dashboard",
    secretServerKey: "your-secret-server-key-from-dashboard",
    tokenStore: "memory",
    superSecretAdminKey: "ADMIN_KEY"
  });

  await adminApp.createApiKey({
    hasPublishableClientKey: true,
    hasSecretServerKey: true,
    hasSuperSecretAdminKey: false,
    description: "Test API Key Please Ignore",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  });
}
