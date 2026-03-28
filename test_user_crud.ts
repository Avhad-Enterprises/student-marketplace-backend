import UserService from "./src/services/users.service";
import DB from "./src/database";

async function testCreateUser() {
    const userService = new UserService();
    try {
        // Get a role ID
        const role = await DB('roles').where({ name: 'Super Admin' }).first();
        if (!role) {
            console.error('Role not found');
            return;
        }

        const userData = {
            first_name: 'Test',
            last_name: 'User',
            email: 'testuser@example.com',
            password: 'password123',
            role_id: role.id
        };

        console.log('Creating user...');
        const user = await userService.createUser(userData);
        console.log('User created:', user);

        console.log('Deleting user...');
        await userService.deleteUser(user.id);
        console.log('User deleted (soft delete).');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await DB.destroy();
    }
}

testCreateUser();
