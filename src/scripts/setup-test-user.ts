import DB from "../database";
import bcrypt from "bcrypt";
import { logger } from "../utils/logger";

async function createTestUser() {
  try {
    const email = "test.user@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await DB("users").where({ email }).first();

    if (existingUser) {
      logger.info(`User ${email} already exists. Updating password.`);
      await DB("users")
        .where({ id: existingUser.id })
        .update({ password_hash: hashedPassword, account_status: "active" });
    } else {
      logger.info(`Creating test user: ${email}`);
      await DB("users").insert({
        user_type: "admin",
        first_name: "Test",
        last_name: "User",
        email: email,
        password_hash: hashedPassword,
        auth_provider: "email_password",
        account_status: "active",
      });
    }

    logger.info("Test user setup complete.");
    process.exit(0);
  } catch (error) {
    logger.error("Error setting up test user:", error);
    process.exit(1);
  }
}

createTestUser();
