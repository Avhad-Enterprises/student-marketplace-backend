import DB from "@/database";
import * as bcrypt from "bcrypt";
import { logger } from "@/utils/logger";

async function seedTestUser() {
    try {
        logger.info("Seeding test user...");

        const email = "admin@example.com";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            user_type: "admin",
            first_name: "Test",
            last_name: "Admin",
            full_name: "Test Admin",
            email: email,
            account_status: "active",
            password_hash: hashedPassword,
            auth_provider: "email_password",
            email_verified: true,
        };

        await DB.table('users')
            .insert(user)
            .onConflict('email')
            .merge({ password_hash: user.password_hash });

        logger.info(`✅ Test user seeded successfully!`);
        logger.info(`📧 Email: ${email}`);
        logger.info(`🔑 Password: ${password}`);

        process.exit(0);
    } catch (err) {
        logger.error("❌ Error seeding test user:", err);
        process.exit(1);
    }
}

seedTestUser();
