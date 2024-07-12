import { prismaClient } from "@/prisma-client";
import { Prisma, TeamSystemPermission as DBTeamSystemPermission } from "@prisma/client";
import { KnownErrors } from "@stackframe/stack-shared";
import { PermissionDefinitionScopeJson } from "@stackframe/stack-shared/dist/interface/clientInterface";
import { ServerPermissionDefinitionCustomizableJson, ServerPermissionDefinitionJson } from "@stackframe/stack-shared/dist/interface/serverInterface";
import { yupString } from "@stackframe/stack-shared/dist/schema-fields";
import { StackAssertionError, throwErr } from "@stackframe/stack-shared/dist/utils/errors";
import { typedToLowercase, typedToUppercase } from "@stackframe/stack-shared/dist/utils/strings";
import * as yup from "yup";

export const teamPermissionIdSchema = yupString()
  .matches(/^\$?[a-z0-9_:]+$/, 'Only lowercase letters, numbers, ":", "_" and optional "$" at the beginning are allowed')
  .test('is-system-permission', 'System permissions must start with a dollar sign', (value, ctx) => {
    if (!value) return true;
    if (value.startsWith('$') && !isTeamSystemPermission(value)) {
      return ctx.createError({ message: 'Invalid system permission' });
    }
    return true;
  });


export const fullPermissionInclude = {
  parentEdges: {
    include: {
      parentPermission: true,
    },
  },
} as const satisfies Prisma.PermissionInclude;

export function isTeamSystemPermission(permission: string): permission is `$${Lowercase<DBTeamSystemPermission>}` {
  return permission.startsWith('$') && permission.slice(1).toUpperCase() in DBTeamSystemPermission;
}

export function teamSystemPermissionStringToDBType(permission: `$${Lowercase<DBTeamSystemPermission>}`): DBTeamSystemPermission {
  return typedToUppercase(permission.slice(1)) as DBTeamSystemPermission;
}

export function teamDBTypeToSystemPermissionString(permission: DBTeamSystemPermission): `$${Lowercase<DBTeamSystemPermission>}` {
  return '$' + typedToLowercase(permission) as `$${Lowercase<DBTeamSystemPermission>}`;
}

const teamSystemPermissionDescriptionMap: Record<DBTeamSystemPermission, string> = {
  "UPDATE_TEAM": "Update the team information",
  "DELETE_TEAM": "Delete the team",
  "READ_MEMBERS": "Read and list the other members of the team",
  "REMOVE_MEMBERS": "Remove other members from the team",
  "INVITE_MEMBERS": "Invite other users to the team",
};

export function serverPermissionDefinitionJsonFromDbType(
  db: Prisma.PermissionGetPayload<{ include: typeof fullPermissionInclude }>
): ServerPermissionDefinitionJson {
  if (!db.projectConfigId && !db.teamId) throw new StackAssertionError(`Permission DB object should have either projectConfigId or teamId`, { db });
  if (db.projectConfigId && db.teamId) throw new StackAssertionError(`Permission DB object should have either projectConfigId or teamId, not both`, { db });
  if (db.scope === "GLOBAL" && db.teamId) throw new StackAssertionError(`Permission DB object should not have teamId when scope is GLOBAL`, { db });

  return {
    __databaseUniqueId: db.dbId,
    id: db.queryableId,
    scope: 
      db.scope === "GLOBAL" ? { type: "global" } :
        db.teamId ? { type: "specific-team", teamId: db.teamId } :
          db.projectConfigId ? { type: "any-team" } :
            throwErr(new StackAssertionError(`Unexpected permission scope`, { db })), 
    description: db.description || undefined,
    containPermissionIds: db.parentEdges.map((edge) => {
      if (edge.parentPermission) {
        return edge.parentPermission.queryableId;
      } else if (edge.parentTeamSystemPermission) {
        return '$' + typedToLowercase(edge.parentTeamSystemPermission);
      } else {
        throw new StackAssertionError(`Permission edge should have either parentPermission or parentSystemPermission`, { edge });
      }
    }),
  };
}

export function serverPermissionDefinitionJsonFromTeamSystemDbType(
  db: DBTeamSystemPermission,
): ServerPermissionDefinitionJson {
  return {
    __databaseUniqueId: '$' + typedToLowercase(db),
    id: '$' + typedToLowercase(db),
    scope: { type: "any-team" },
    description: teamSystemPermissionDescriptionMap[db],
    containPermissionIds: [],
  };
}

export async function listServerPermissionDefinitions(projectId: string, scope?: PermissionDefinitionScopeJson): Promise<ServerPermissionDefinitionJson[]> {
  const results = [];
  switch (scope?.type) {
    case "specific-team": {
      const team = await prismaClient.team.findUnique({
        where: {
          projectId_teamId: {
            projectId,
            teamId: scope.teamId,
          },
        },
        include: {
          permissions: {
            include: fullPermissionInclude,
          },
        },
      });
      if (!team) throw new KnownErrors.TeamNotFound(scope.teamId);
      results.push(...team.permissions.map(serverPermissionDefinitionJsonFromDbType));
      break;
    }
    case "global":
    case "any-team": {
      const res = await prismaClient.permission.findMany({
        where: {
          projectConfig: {
            projects: {
              some: {
                id: projectId,
              }
            }
          },
          scope: scope.type === "global" ? "GLOBAL" : "TEAM",
        },
        include: fullPermissionInclude,
      });
      results.push(...res.map(serverPermissionDefinitionJsonFromDbType));
      break;
    }
    case undefined: {
      const res = await prismaClient.permission.findMany({
        where: {
          projectConfig: {
            projects: {
              some: {
                id: projectId,
              }
            }
          },
        },
        include: fullPermissionInclude,
      });
      results.push(...res.map(serverPermissionDefinitionJsonFromDbType));
    }
  }

  if (scope === undefined || scope.type === "any-team" || scope.type === "specific-team") {
    for (const systemPermission of Object.values(DBTeamSystemPermission)) {
      results.push(serverPermissionDefinitionJsonFromTeamSystemDbType(systemPermission));
    }
  }

  return results;
}

export async function listUserPermissionDefinitionsRecursive({
  projectId, 
  teamId, 
  userId, 
  type,
}: {
  projectId: string, 
  teamId: string,
  userId: string, 
  type: 'team' | 'global',
}): Promise<ServerPermissionDefinitionJson[]> {
  const allPermissions = [];
  if (type === 'team') {
    allPermissions.push(...await listServerPermissionDefinitions(projectId, { type: "specific-team", teamId }));
    allPermissions.push(...await listServerPermissionDefinitions(projectId, { type: "any-team" }));
  } else {
    allPermissions.push(...await listServerPermissionDefinitions(projectId, { type: "global" }));
  }
  const permissionsMap = new Map(allPermissions.map(p => [p.id, p]));

  const user = await prismaClient.teamMember.findUnique({
    where: {
      projectId_projectUserId_teamId: {
        projectId,
        projectUserId: userId,
        teamId,
      },
    },
    include: {
      directPermissions: {
        include: {
          permission: true,
        }
      }
    },
  });  

  if (!user) throw new KnownErrors.UserNotFound();
  
  const result = new Map<string, ServerPermissionDefinitionJson>();
  const idsToProcess = [...user.directPermissions.map(p => 
    p.permission?.queryableId || 
    (p.systemPermission ? teamDBTypeToSystemPermissionString(p.systemPermission) : null) ||
    throwErr(new StackAssertionError(`Permission should have either queryableId or systemPermission`, { p }))
  )];
  while (idsToProcess.length > 0) {
    const currentId = idsToProcess.pop()!;
    const current = permissionsMap.get(currentId);
    if (!current) throw new StackAssertionError(`Couldn't find permission in DB`, { currentId, result, idsToProcess });
    if (result.has(current.id)) continue;
    result.set(current.id, current);
    idsToProcess.push(...current.containPermissionIds);
  }
  return [...result.values()];
}

export async function listUserDirectPermissions({
  projectId, 
  teamId, 
  userId, 
  type,
}: {
  projectId: string, 
  teamId: string,
  userId: string, 
  type: 'team' | 'global',
}): Promise<ServerPermissionDefinitionJson[]> {
  const user = await prismaClient.teamMember.findUnique({
    where: {
      projectId_projectUserId_teamId: {
        projectId,
        projectUserId: userId,
        teamId,
      },
    },
    include: {
      directPermissions: {
        include: {
          permission: {
            include: fullPermissionInclude,
          }
        }
      }
    },
  });
  if (!user) throw new KnownErrors.UserNotFound();
  return user.directPermissions.map(
    p => {
      if (p.permission) {
        return serverPermissionDefinitionJsonFromDbType(p.permission);
      } else if (p.systemPermission) {
        return serverPermissionDefinitionJsonFromTeamSystemDbType(p.systemPermission);
      } else {
        throw new StackAssertionError(`Permission should have either permission or systemPermission`, { p });
      }
    }
  ).filter(
    p => {
      switch (p.scope.type) {
        case "global": {
          return type === "global";
        }
        case "any-team":
        case "specific-team": {
          return type === "team";
        }
      }
    }
  );
}

export async function listPotentialParentPermissions(projectId: string, scope: PermissionDefinitionScopeJson): Promise<ServerPermissionDefinitionJson[]> {
  if (scope.type === "global") {
    return await listServerPermissionDefinitions(projectId, { type: "global" });
  } else {
    const scopes: PermissionDefinitionScopeJson[] = [
      { type: "any-team" },
      ...scope.type === "any-team" ? [] : [
        { type: "specific-team", teamId: scope.teamId } as const,
      ],
    ];

    return await Promise.all(scopes.map(s => listServerPermissionDefinitions(projectId, s))).then(res => res.flat(1));
  }
}

export async function createPermissionDefinition(
  projectId: string, 
  scope: PermissionDefinitionScopeJson, 
  permission: ServerPermissionDefinitionCustomizableJson
): Promise<ServerPermissionDefinitionJson> {
  const project = await prismaClient.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!project) throw new KnownErrors.ProjectNotFound();

  let parentDbIds = [];
  const potentialParentPermissions = await listPotentialParentPermissions(projectId, scope);
  for (const parentPermissionId of permission.containPermissionIds) {
    const parentPermission = potentialParentPermissions.find(p => p.id === parentPermissionId);
    if (!parentPermission) throw new KnownErrors.PermissionNotFound(parentPermissionId);
    parentDbIds.push(parentPermission.__databaseUniqueId);
  }
  const dbPermission = await prismaClient.permission.create({
    data: {
      scope: scope.type === "global" ? "GLOBAL" : "TEAM",
      queryableId: permission.id,
      description: permission.description,
      ...scope.type === "specific-team" ? {
        projectId: project.id,
        teamId: scope.teamId,
      } : {
        projectConfigId: project.configId,
      },
      parentEdges: {
        create: parentDbIds.map(parentDbId => {
          if (isTeamSystemPermission(parentDbId)) {
            return {
              parentTeamSystemPermission: teamSystemPermissionStringToDBType(parentDbId),
            };
          } else {
            return {
              parentPermission: {
                connect: {
                  dbId: parentDbId,
                },
              },
            };
          }
        })
      },
    },
    include: fullPermissionInclude,
  });
  return serverPermissionDefinitionJsonFromDbType(dbPermission);
}

export async function updatePermissionDefinitions(
  projectId: string, 
  scope: PermissionDefinitionScopeJson, 
  permissionId: string, 
  permission: Partial<ServerPermissionDefinitionCustomizableJson>
): Promise<ServerPermissionDefinitionJson> {
  const project = await prismaClient.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!project) throw new KnownErrors.ProjectNotFound();

  let parentDbIds: string[] = [];
  if (permission.containPermissionIds) {
    const potentialParentPermissions = await listPotentialParentPermissions(projectId, scope);
    for (const parentPermissionId of permission.containPermissionIds) {
      const parentPermission = potentialParentPermissions.find(p => p.id === parentPermissionId);
      if (!parentPermission) throw new KnownErrors.PermissionNotFound(parentPermissionId);
      parentDbIds.push(parentPermission.__databaseUniqueId);
    }
  }

  let edgeUpdateData = {};
  if (permission.containPermissionIds) {
    edgeUpdateData = {
      parentEdges: {
        deleteMany: {},
        create: parentDbIds.map(parentDbId => {
          if (isTeamSystemPermission(parentDbId)) {
            return {
              parentTeamSystemPermission: teamSystemPermissionStringToDBType(parentDbId),
            };
          } else {
            return {
              parentPermission: {
                connect: {
                  dbId: parentDbId,
                },
              },
            };
          }
        }),
      },
    };
  }

  const dbPermission = await prismaClient.permission.update({
    where: {
      projectConfigId_queryableId: {
        projectConfigId: project.configId,
        queryableId: permissionId,
      },
    },
    data: {
      queryableId: permission.id,
      description: permission.description,
      ...edgeUpdateData,
    },
    include: fullPermissionInclude,
  });
  return serverPermissionDefinitionJsonFromDbType(dbPermission);
}

export async function deletePermissionDefinition(projectId: string, scope: PermissionDefinitionScopeJson, permissionId: string) {
  switch (scope.type) {
    case "global":
    case "any-team": {
      const project = await prismaClient.project.findUnique({
        where: {
          id: projectId,
        },
      });
      if (!project) throw new KnownErrors.ProjectNotFound();
      const deleted = await prismaClient.permission.deleteMany({
        where: {
          projectConfigId: project.configId,
          queryableId: permissionId,
        },
      });
      if (deleted.count < 1) throw new KnownErrors.PermissionNotFound(permissionId);
      break;
    }
    case "specific-team": {
      const team = await prismaClient.team.findUnique({
        where: {
          projectId_teamId: {
            projectId,
            teamId: scope.teamId,
          },
        },
      });
      if (!team) throw new KnownErrors.TeamNotFound(scope.teamId);
      const deleted = await prismaClient.permission.deleteMany({
        where: {
          projectId,
          queryableId: permissionId,
          teamId: scope.teamId,
        },
      });
      if (deleted.count < 1) throw new KnownErrors.PermissionNotFound(permissionId);
      break;
    }
  }
}
