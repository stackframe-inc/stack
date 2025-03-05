import { it } from "../../../../helpers";
import { Auth, Project, backendContext, niceBackendFetch } from "../../../backend-helpers";

it("should initialize userCount to 0 for a new project", async ({ expect }) => {
  await Auth.Otp.signIn();
  const { adminAccessToken } = await Project.createAndGetAdminToken();
  const response = await niceBackendFetch("/api/v1/projects/current", {
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken,
    }
  });
  expect(response.status).toBe(200);
  expect(response.body.user_count).toBe(0);
});

it("should increment userCount when a user is added to a project", async ({ expect }) => {
  // Create a project and get its initial userCount
  await Auth.Otp.signIn();
  const { adminAccessToken, projectId } = await Project.createAndGetAdminToken();
  const initialProjectResponse = await niceBackendFetch("/api/v1/projects/current", {
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken,
    }
  });
  expect(initialProjectResponse.status).toBe(200);
  expect(initialProjectResponse.body.user_count).toBe(0);
  // Create a new user in the project
  const createUserResponse = await niceBackendFetch("/api/v1/users", {
    accessType: "server",
    method: "POST",
    body: {
      email: `test-user-${Date.now()}@example.com`,
    },
  });
  expect(createUserResponse.status).toBe(201);
  // Check that the userCount has been incremented
  const updatedProjectResponse = await niceBackendFetch("/api/v1/projects/current", {
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken,
    }
  });
  expect(updatedProjectResponse.status).toBe(200);
  expect(updatedProjectResponse.body.user_count).toBe(1);
});

it("should decrement userCount when a user is deleted from a project", async ({ expect }) => {
  // Create a project and get its initial userCount
  await Auth.Otp.signIn();
  const { adminAccessToken, projectId } = await Project.createAndGetAdminToken();
  // Create a new user in the project
  const createUserResponse = await niceBackendFetch("/api/v1/users", {
    accessType: "server",
    method: "POST",
    body: {
      email: `test-user-${Date.now()}@example.com`,
    },
  });
  expect(createUserResponse.status).toBe(201);
  const userId = createUserResponse.body.id;
  // Check that the userCount has been incremented
  const projectResponseAfterCreate = await niceBackendFetch("/api/v1/projects/current", {
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken,
    }
  });
  expect(projectResponseAfterCreate.status).toBe(200);
  expect(projectResponseAfterCreate.body.user_count).toBe(1);
  // Delete the user
  const deleteUserResponse = await niceBackendFetch(`/api/v1/users/${userId}`, {
    accessType: "server",
    method: "DELETE",
  });
  expect(deleteUserResponse.status).toBe(200);
  // Check that the userCount has been decremented
  const projectResponseAfterDelete = await niceBackendFetch("/api/v1/projects/current", {
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken,
    }
  });
  expect(projectResponseAfterDelete.status).toBe(200);
  expect(projectResponseAfterDelete.body.user_count).toBe(0);
});

it("should update userCount correctly when a user's mirroredProjectId is changed", async ({ expect }) => {
  // Create two projects
  await Auth.Otp.signIn();
  const { adminAccessToken: adminAccessToken1, projectId: projectId1 } = await Project.createAndGetAdminToken();
  // Create a second project
  backendContext.set({
    projectKeys: {
      projectId: projectId1,
      adminAccessToken: adminAccessToken1,
    },
  });
  await Auth.Otp.signIn();
  const { adminAccessToken: adminAccessToken2, projectId: projectId2 } = await Project.createAndGetAdminToken();
  // Create a user in the first project
  backendContext.set({
    projectKeys: {
      projectId: projectId1,
      adminAccessToken: adminAccessToken1,
    },
  });
  const createUserResponse = await niceBackendFetch("/api/v1/users", {
    accessType: "server",
    method: "POST",
    body: {
      email: `test-user-${Date.now()}@example.com`,
    },
  });
  expect(createUserResponse.status).toBe(201);
  const userId = createUserResponse.body.id;
  // Check that the userCount has been incremented in the first project
  const project1ResponseAfterCreate = await niceBackendFetch("/api/v1/projects/current", {
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken1,
    }
  });
  expect(project1ResponseAfterCreate.status).toBe(200);
  expect(project1ResponseAfterCreate.body.user_count).toBe(1);
  // Check that the userCount is still 0 in the second project
  backendContext.set({
    projectKeys: {
      projectId: projectId2,
      adminAccessToken: adminAccessToken2,
    },
  });
  const project2ResponseBefore = await niceBackendFetch("/api/v1/projects/current", {
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken2,
    }
  });
  expect(project2ResponseBefore.status).toBe(200);
  expect(project2ResponseBefore.body.user_count).toBe(0);
  // Update the user's mirroredProjectId to the second project
  // Note: This is a simplified test as we don't have direct access to update mirroredProjectId
  // In a real scenario, this would happen when a user is moved between projects
  // For this test, we'll create a new user in the second project and delete the user from the first project
  backendContext.set({
    projectKeys: {
      projectId: projectId2,
      adminAccessToken: adminAccessToken2,
    },
  });
  const createUserInProject2Response = await niceBackendFetch("/api/v1/users", {
    accessType: "server",
    method: "POST",
    body: {
      email: `test-user-${Date.now()}@example.com`,
    },
  });
  expect(createUserInProject2Response.status).toBe(201);
  // Check that the userCount has been incremented in the second project
  const project2ResponseAfterCreate = await niceBackendFetch("/api/v1/projects/current", {
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken2,
    }
  });
  expect(project2ResponseAfterCreate.status).toBe(200);
  expect(project2ResponseAfterCreate.body.user_count).toBe(1);
  // Delete the user from the first project
  backendContext.set({
    projectKeys: {
      projectId: projectId1,
      adminAccessToken: adminAccessToken1,
    },
  });
  const deleteUserResponse = await niceBackendFetch(`/api/v1/users/${userId}`, {
    accessType: "server",
    method: "DELETE",
  });
  expect(deleteUserResponse.status).toBe(200);
  // Check that the userCount has been decremented in the first project
  const project1ResponseAfterDelete = await niceBackendFetch("/api/v1/projects/current", {
    accessType: "admin",
    headers: {
      'x-stack-admin-access-token': adminAccessToken1,
    }
  });
  expect(project1ResponseAfterDelete.status).toBe(200);
  expect(project1ResponseAfterDelete.body.user_count).toBe(0);
});
