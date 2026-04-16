import DB from '../database';
import bcrypt from 'bcrypt';

async function resetAdmin() {
    try {
        console.log('Force resetting admin password...');

        const email = 'admin@example.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await DB('users').where({ email }).first();

        if (!user) {
            console.log('Admin user not found. Creating new one...');
            // If doesn't exist, create it (fallback)
            const { v4: uuidv4 } = require('uuid');
            await DB('users').insert({
                id: uuidv4(),
                email,
                password_hash: hashedPassword,
                user_type: 'admin',
                first_name: 'Admin',
                last_name: 'User',
                full_name: 'Admin User',
                account_status: 'active',
                email_verified: true,
                auth_provider: 'email_password'
            });
        } else {
            console.log(`Found user ${user.id}. Updating password...`);
            await DB('users').where({ id: user.id }).update({
                password_hash: hashedPassword,
                account_status: 'active'
            });
        }

        console.log('\u2705 Admin password reset to: password123');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting admin:', error);
        process.exit(1);
    }
}

resetAdmin();
