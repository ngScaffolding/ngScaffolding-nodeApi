import { Role } from '../../models/index';

export interface IRolesDataAccess {
  // Get All Roles - For Admin Purposes
  getRoles(): Promise<Role[]>;
  deleteRole(name: string): Promise<any>;
  addRole(role: Role): Promise<any>;
  updateRole(role: Role): Promise<any>;
}
