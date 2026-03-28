import bcrypt from "bcrypt";
import DB from "../database";
import HttpException from "../exceptions/HttpException";
import { User } from "../interfaces/users.interface";

class UserService {
  /**
   * Find all users with role information
   */
  public async findAllUsers(): Promise<any[]> {
    const users = await DB('users')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .select(
        'users.id',
        'users.email',
        'users.full_name',
        'users.user_type',
        'users.account_status',
        'users.last_login_at',
        'roles.name as role_name',
        'roles.id as role_id'
      )
      .where('users.is_deleted', false);
    return users;
  }

  /**
   * Find user by ID
   */
  public async findUserById(userId: string): Promise<User> {
    const user: User = await DB('users').where('id', userId).first();
    if (!user) throw new HttpException(404, "User not found");
    return user;
  }

  /**
   * Update user details (including role)
   */
  public async updateUser(userId: string, userData: Partial<User & { role_id: string }>): Promise<User> {
    const [user]: User[] = await DB('users')
      .where('id', userId)
      .update({ 
        ...userData,
        updated_at: new Date() 
      })
      .returning('*');
    if (!user) throw new HttpException(404, "User not found");
    return user;
  }

  /**
   * Delete user (soft delete)
   */
  public async deleteUser(userId: string): Promise<void> {
    const deleteCount = await DB('users')
      .where('id', userId)
      .update({ is_deleted: true, deleted_at: new Date() });
    if (!deleteCount) throw new HttpException(404, "User not found");
  }

  /**
   * Create a new user
   */
  public async createUser(userData: any): Promise<User> {
    const { email, password, first_name, last_name, role_id } = userData;

    // Check if user already exists
    const findUser = await DB('users').where({ email }).first();
    if (findUser) throw new HttpException(409, `User with email ${email} already exists`);

    // Hash password
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);

    // Insert user
    const [user]: User[] = await DB('users')
      .insert({
        first_name,
        last_name,
        full_name: `${first_name} ${last_name || ''}`.trim(),
        email,
        password_hash: hashedPassword,
        role_id,
        user_type: 'admin',
        auth_provider: 'email_password',
        account_status: 'Active',
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return user;
  }
}

export default UserService;
