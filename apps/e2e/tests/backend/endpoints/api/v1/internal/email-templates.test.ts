import { it } from "../../../../../helpers";
import { Auth, Project, niceBackendFetch } from "../../../../backend-helpers";

it("should not allow updating email templates when using shared email config", async ({ expect }) => {
  // Create a project with shared email config (default)
  await Auth.Otp.signIn();
  const { adminAccessToken } = await Project.createAndGetAdminToken();

  // Try to update an email template
  const response = await niceBackendFetch("/api/v1/email-templates/password_reset", {
    method: "PATCH",
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken,
    },
    body: {
      subject: "Custom Password Reset",
      content: {}, // Need to provide a valid content structure instead of text_body/html_body
    },
  });

  // Verify that the update was rejected
  expect(response).toMatchInlineSnapshot(`
    NiceResponse {
      "status": 400,
      "body": "Cannot update email templates in shared email config. Set up a custom email config to update email templates.",
      "headers": Headers { <some fields may have been hidden> },
    }
  `);
});
