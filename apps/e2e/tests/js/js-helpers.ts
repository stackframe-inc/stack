import { StackAdminApp } from '@stackframe/js';

export function scaffoldProject() {
  const stk = new StackAdminApp({
    projectId: "internal",
    publishableClientKey: "your-publishable-client-key-from-dashboard",
    secretServerKey: "your-secret-server-key-from-dashboard",
    tokenStore: "memory",
    superSecretAdminKey: "ADMIN_KEY"
  });
}
