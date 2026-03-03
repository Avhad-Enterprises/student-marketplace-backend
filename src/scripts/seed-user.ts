import DB from '../database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seedUser() {
    try {
        console.log('Seeding initial admin user...');

        const email = 'admin@example.com';
        const password = 'Admin@123';
        const passwordHash = await bcrypt.hash(password, 10);

        // Check if user already exists
        const existingUser = await DB('users').where({ email }).first();

        if (existingUser) {
            console.log('User already exists. Skipping seeding.');
            process.exit(0);
        }

        await DB('users').insert({
            id: uuidv4(),
            user_type: 'admin',
            first_name: 'Admin',
            last_name: 'User',
            full_name: 'Admin User',
            email: email,
            password_hash: passwordHash,
            auth_provider: 'email_password',
            account_status: 'active',
            email_verified: true,
            created_at: new Date(),
            updated_at: new Date()
        });

        console.log('Admin user seeded successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding user:', error);
        process.exit(1);
    }
}

seedUser();
