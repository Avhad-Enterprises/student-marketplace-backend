
import DB from '../database';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger';

async function seedAdmin() {
  try {
    logger.info("Seeding Admin user and role...");

    // 1. Create Roles table if it doesn't exist (just in case)
    await DB.raw(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        permissions JSONB NOT NULL,
        is_system BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Users table if it doesn't exist
    await DB.raw(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        role_id INTEGER REFERENCES roles(id),
        user_type VARCHAR(50) DEFAULT 'admin',
        account_status VARCHAR(50) DEFAULT 'Active',
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create Admin Role
    const adminPermissions = {
      dashboard: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      students: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      "students-status": { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      services: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      bookings: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      finance: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      reports: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      settings: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
    };

    await DB('roles').insert({
      name: 'Admin',
      permissions: JSON.stringify(adminPermissions),
      is_system: true,
      updated_at: new Date()
    }).onConflict('name').merge();

    const adminRole = await DB('roles').where({ name: 'Admin' }).first();

    // 4. Create Admin User
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await DB('users').insert({
      email: 'admin@example.com',
      password_hash: hashedPassword,
      full_name: 'System Admin',
      first_name: 'System',
      last_name: 'Admin',
      role_id: adminRole.id,
      user_type: 'admin',
      account_status: 'Active',
      updated_at: new Date()
    }).onConflict('email').merge();

    logger.info("Admin user and role seeded successfully!");
    process.exit(0);
  } catch (err) {
    logger.error("Error seeding admin:", err);
    process.exit(1);
  }
}

seedAdmin();
