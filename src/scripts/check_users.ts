import DB from '../database';

async function checkUsers() {
    try {
        console.log('Checking users table...');
        const users = await DB('users').select('id', 'email', 'user_type', 'password_hash');
        console.log('Current Users in Database:');
        console.table(users);
        
        const admin = users.find(u => u.email === 'admin@example.com');
        if (admin) {
            console.log('\u2705 Admin user FOUND');
            console.log(`Hash exists: ${!!admin.password_hash}`);
        } else {
            console.log('\u274C Admin user NOT FOUND');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error checking users:', error);
        process.exit(1);
    }
}

checkUsers();
