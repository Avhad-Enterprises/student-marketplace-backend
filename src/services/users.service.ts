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
  public async updateUser(userId: string, userData: any): Promise<User> {
    const updateData: any = { ...userData };

    // 1. Handle Password Hashing
    if (updateData.password) {
      if (updateData.password.length < 8) throw new HttpException(400, "Password must be at least 8 characters");
      updateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }

    // 2. Handle Name Sync
    if (updateData.first_name || updateData.last_name) {
      // Fetch existing user to get current names if only one is provided
      const existingUser = await this.findUserById(userId);
      const fName = updateData.first_name || existingUser.first_name;
      const lName = updateData.last_name || existingUser.last_name;
      updateData.full_name = `${fName} ${lName || ''}`.trim();
    }

    const [user]: User[] = await DB('users')
      .where('id', userId)
      .update({ 
        ...updateData,
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
  /**
   * Reset a user's password (admin action) — bcrypt hashes the new password
   */
  public async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    const user = await DB('users').where('id', userId).first();
    if (!user) throw new HttpException(404, "User not found");

    if (!newPassword || newPassword.length < 6) {
      throw new HttpException(400, "Password must be at least 6 characters");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await DB('users')
      .where('id', userId)
      .update({ password_hash: hashedPassword, updated_at: new Date() });
  }
}

export default UserService;
