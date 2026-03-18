import DB from '../database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seedNewUser() {
    try {
        console.log('Seeding another test user for initials verification...');

        const email = 'janedoe@example.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            id: uuidv4(),
            user_type: "admin",
            first_name: "Jane",
            last_name: "Doe",
            full_name: "Jane Doe",
            email: email,
            account_status: "active",
            password_hash: hashedPassword,
            auth_provider: "email_password",
            email_verified: true,
            created_at: new Date(),
            updated_at: new Date()
        };

        await DB('users')
            .insert(user)
            .onConflict('email')
            .merge({ password_hash: user.password_hash });

        console.log(`✅ Test user Jane Doe seeded successfully!`);
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding test user:", err);
        process.exit(1);
    }
}

seedNewUser();
