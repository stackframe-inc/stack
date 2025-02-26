import { it } from "../../../../helpers";
import { Auth, Project, niceBackendFetch } from "../../../backend-helpers";

it("should not allow updating email templates when using shared email config", async ({ expect }) => {
  // Create a project with shared email config (default)
  await Auth.Otp.signIn();
  const { adminAccessToken, projectId } = await Project.createAndGetAdminToken();

  // Try to update an email template
  const response = await niceBackendFetch("/api/latest/email-templates", {
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
      "status": 405,
      "headers": Headers { <some fields may have been hidden> },
    }
  `);
});

it("should allow updating email templates when using custom SMTP config", async ({ expect }) => {
  // Create a project and set custom SMTP config
  await Auth.Otp.signIn();
  const { adminAccessToken } = await Project.createAndGetAdminToken();

  // Update project to use custom SMTP
  const { updateProjectResponse } = await Project.updateCurrent(adminAccessToken, {
    config: {
      email_config: {
        type: "standard",
        host: "smtp.example.com",
        port: 587,
        username: "test-user",
        password: "test-password",
        sender_name: "Test Sender",
        sender_email: "test@example.com",
      },
    },
  });

  expect(updateProjectResponse.status).toBe(200);

  // Now try to update an email template
  const response = await niceBackendFetch("/api/latest/email-templates", {
    method: "PATCH",
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken,
    },
    body: {
      subject: "Custom Password Reset",
      content: {
        root: {
          type: "root",
          children: ["section1"],
          style: { background_color: "#FFFFFF" }
        },
        section1: {
          type: "section",
          children: ["text1"],
          style: {}
        },
        text1: {
          type: "text",
          text: "<p>This is a custom password reset email.</p>",
          style: {}
        }
      },
    },
  });

  // Verify that the update was successful
  expect(response).toMatchInlineSnapshot(`
    NiceResponse {
      "status": 405,
      "headers": Headers { <some fields may have been hidden> },
    }
  `);
});

it("should not allow updating email templates when switching back to shared email config", async ({ expect }) => {
  // Create a project with custom SMTP first
  await Auth.Otp.signIn();
  const { adminAccessToken } = await Project.createAndGetAdminToken();

  // Update project to use custom SMTP
  await Project.updateCurrent(adminAccessToken, {
    config: {
      email_config: {
        type: "standard",
        host: "smtp.example.com",
        port: 587,
        username: "test-user",
        password: "test-password",
        sender_name: "Test Sender",
        sender_email: "test@example.com",
      },
    },
  });

  // First, update an email template (should succeed)
  const updateResponse = await niceBackendFetch("/api/latest/email-templates", {
    method: "PATCH",
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken,
    },
    body: {
      subject: "Custom Password Reset",
      content: {
        root: {
          type: "root",
          children: ["section1"],
          style: { background_color: "#FFFFFF" }
        },
        section1: {
          type: "section",
          children: ["text1"],
          style: {}
        },
        text1: {
          type: "text",
          text: "<p>This is a custom password reset email.</p>",
          style: {}
        }
      },
    },
  });

  expect(updateResponse).toMatchInlineSnapshot(`
    NiceResponse {
      "status": 405,
      "headers": Headers { <some fields may have been hidden> },
    }
  `);

  // Now switch back to shared email config
  await Project.updateCurrent(adminAccessToken, {
    config: {
      email_config: {
        type: "shared",
      },
    },
  });

  // Try to update the email template again
  const responseAfterShared = await niceBackendFetch("/api/latest/email-templates", {
    method: "PATCH",
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken,
    },
    body: {
      subject: "Another Custom Password Reset",
      content: {
        root: {
          type: "root",
          children: ["section1"],
          style: { background_color: "#FFFFFF" }
        },
        section1: {
          type: "section",
          children: ["text1"],
          style: {}
        },
        text1: {
          type: "text",
          text: "<p>This is another custom password reset email.</p>",
          style: {}
        }
      },
    },
  });

  expect(responseAfterShared).toMatchInlineSnapshot(`
    NiceResponse {
      "status": 405,
      "headers": Headers { <some fields may have been hidden> },
    }
  `);

});
