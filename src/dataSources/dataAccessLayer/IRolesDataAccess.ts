import { Role } from '../../models/index';

export interface IRolesDataAccess {
  // Get All Roles - For Admin Purposes
  getRoles(): Promise<Role[]>;
  deleteRole(name: string): Promise<null>;
  addRole(role: Role): Promise<null>;
  updateRole(role: Role): Promise<null>;
}
