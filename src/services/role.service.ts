import DB from "../database";
import HttpException from "../exceptions/HttpException";
import { Role } from "../interfaces/roles.interface";

class RoleService {
  /**
   * Find all roles
   */
  public async findAllRoles(): Promise<any[]> {
    const roles = await DB('roles')
      .leftJoin('users', 'roles.id', 'users.role_id')
      .select('roles.*')
      .count('users.id as usersCount')
      .groupBy('roles.id');
    return roles;
  }

  /**
   * Find role by ID
   */
  public async findRoleById(roleId: string): Promise<Role> {
    const role: Role = await DB('roles').where('id', roleId).first();
    if (!role) throw new HttpException(404, "Role not found");
    return role;
  }

  /**
   * Create a new role
   */
  public async createRole(roleData: Partial<Role>): Promise<Role> {
    const [role]: Role[] = await DB('roles').insert(roleData).returning('*');
    return role;
  }

  /**
   * Update an existing role
   */
  public async updateRole(roleId: string, roleData: Partial<Role>): Promise<Role> {
    const [role]: Role[] = await DB('roles').where('id', roleId).update({
      ...roleData,
      updated_at: new Date(),
    }).returning('*');
    if (!role) throw new HttpException(404, "Role not found");
    return role;
  }

  /**
   * Delete a role
   */
  public async deleteRole(roleId: string): Promise<void> {
    const deleteCount = await DB('roles').where('id', roleId).delete();
    if (!deleteCount) throw new HttpException(404, "Role not found");
  }
}

export default RoleService;
