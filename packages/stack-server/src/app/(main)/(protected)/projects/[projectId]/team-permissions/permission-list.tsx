import { Paragraph } from "@/components/paragraph";
import { Box, Checkbox, Divider, List, Stack } from "@mui/joy";
import { useEffect, useState } from "react";
import { useAdminApp } from "../use-admin-app";
import { ServerPermissionJson } from "@stackframe/stack-shared/dist/interface/serverInterface";
import { ServerPermission } from "@stackframe/stack";

const PLACEHOLDER_ID = 'f2j1290ajf9812elk';

export class PermissionGraph {
  permissions: Record<string, ServerPermissionJson>;

  constructor(permissions: ServerPermissionJson[]) {
    this.permissions = this._copyPermissions(permissions);
  }

  copy(): PermissionGraph {
    return new PermissionGraph(Object.values(this.permissions));
  }

  _copyPermissions(permissions: ServerPermissionJson[]): Record<string, ServerPermissionJson> {
    const result: Record<string, ServerPermissionJson> = {};
    permissions.forEach(permission => {
      result[permission.id] = {
        ...permission, 
        inheritFromPermissionIds: [...permission.inheritFromPermissionIds]
      };
    });
    return result;
  }

  updatePermission(
    permissionId: string,
    permission: ServerPermissionJson
  ) {
    const permissions = this._copyPermissions(Object.values(this.permissions));
    permissions[permissionId] = permission;

    for (const [key, value] of Object.entries(permissions)) {
      permissions[key] = {
        ...value,
        inheritFromPermissionIds: value.inheritFromPermissionIds.map(id => id === permissionId ? permission.id : id)
      };
    }
    
    return new PermissionGraph(Object.values(permissions));
  }

  addPermission() {
    const permissions = this._copyPermissions(Object.values(this.permissions));
    permissions[PLACEHOLDER_ID] = {
      id: PLACEHOLDER_ID,
      description: 'none',
      scope: { type: 'any-team' },
      __databaseUniqueId: 'none',
      inheritFromPermissionIds: []
    };
    return new PermissionGraph(Object.values(permissions));
  }

  replacePermission(permissionId: string) {
    const permissions = this._copyPermissions(Object.values(this.permissions));
    const oldPermission = permissions[permissionId];
    delete permissions[permissionId];
    permissions[PLACEHOLDER_ID] = {
      ...oldPermission,
      id: PLACEHOLDER_ID,
    };
    for (const [key, value] of Object.entries(permissions)) {
      permissions[key] = {
        ...value,
        inheritFromPermissionIds: value.inheritFromPermissionIds.map(id => id === permissionId ? PLACEHOLDER_ID : id)
      };
    }

    return new PermissionGraph(Object.values(permissions));
  }

  recursiveContains(permissionId: string): ServerPermissionJson[] {
    const permission = this.permissions[permissionId];
    if (!permission) throw new Error(`Permission with id ${permissionId} not found`);
    return [permission].concat(
      permission.inheritFromPermissionIds.flatMap(id => this.recursiveContains(id))
    );
  }

  hasPermission(permissionId: string, targetPermissionId: string): boolean {
    return this.recursiveContains(permissionId).some(permission => permission.id === targetPermissionId);
  }

  recursiveAccestors(permissionId: string): ServerPermissionJson[] {
    const permission = this.permissions[permissionId];
    if (!permission) throw new Error(`Permission with id ${permissionId} not found`);
    
    const ancestors = [];
    for (const [key, permission] of Object.entries(this.permissions)) {
      if (this.hasPermission(permission.id, permissionId)) {
        ancestors.push(permission);
      }
    }

    return ancestors;
  }
}

export function PermissionList(props : {
  selectedPermissionId?: string,
  permissionGraph: PermissionGraph,
  updatePermission: (permissionId: string, permission: ServerPermissionJson) => void,
}) {
  const graph = props.permissionGraph;
  const currentPermission = graph.permissions[PLACEHOLDER_ID];
  
  return (
    <List sx={{ maxHeight: 300, overflow: 'auto' }}>
      {Object.values(graph.permissions).map((permission) => {
        if (permission.id === PLACEHOLDER_ID) return null;

        const selected = currentPermission.inheritFromPermissionIds.includes(permission.id);
        const contain = graph.hasPermission(PLACEHOLDER_ID, permission.id);
        const inheritedFrom = graph.recursiveAccestors(permission.id).map(p => p.id).filter(
          id => id !== permission.id && id !== PLACEHOLDER_ID && currentPermission.inheritFromPermissionIds.includes(id)
        );

        return (
          <Box key={permission.id}>
            <Stack spacing={1} direction={"row"} alignItems={"center"}>
              <Checkbox
                // checked={selected}
                // variant={inheritedFrom.length > 0 ? "solid" : "outlined"}
                color={'primary'}
                onChange={(event) => {
                  const checked = event.target.checked;
                  const oldInherited = currentPermission.inheritFromPermissionIds.filter(id => id !== permission.id);
                  props.updatePermission(
                    PLACEHOLDER_ID,
                    {
                      ...currentPermission,
                      inheritFromPermissionIds: checked ? [...oldInherited, permission.id] : oldInherited
                    }
                  );
                }}
              />
              <Paragraph body>
                {permission.id}
                {contain && inheritedFrom.length > 0 && <span> (inherited from {inheritedFrom.join(', ')})</span>}
              </Paragraph>
            </Stack>
            <Divider sx={{ margin: 1 }} />
          </Box>
        );
      })}
    </List>
  );
}