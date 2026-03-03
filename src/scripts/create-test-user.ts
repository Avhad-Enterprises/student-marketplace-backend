import DB from "@/database";
import { logger } from "@/utils/logger";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function createTestUser() {
  try {
    logger.info("Creating test user...");

    const email = "test.user@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    const existingUser = await DB('users').where({ email }).first();
    if (existingUser) {
      logger.info(`User ${email} already exists. Updating password...`);
      await DB('users').where({ email }).update({
        password_hash: hashedPassword,
        updated_at: new Date()
      });
      logger.info("User updated.");
    } else {
      await DB('users').insert({
        id: uuidv4(),
        email: email,
        password_hash: hashedPassword,
        first_name: "Test",
        last_name: "User",
        full_name: "Test User",
        user_type: "admin", // or whatever type is appropriate
        auth_provider: "email_password",
        account_status: "active",
        email_verified: true,
        phone_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      logger.info(`User ${email} created.`);
    }

    process.exit(0);
  } catch (err) {
    logger.error("Error creating test user:", err);
    process.exit(1);
  }
}

createTestUser();
