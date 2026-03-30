/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Create roles table
    const hasRoles = await knex.schema.hasTable('roles');
    if (!hasRoles) {
        await knex.schema.createTable('roles', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
            table.string('name', 100).notNullable().unique();
            table.text('description').nullable();
            table.jsonb('permissions').defaultTo('{}');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });

        // Seed default roles ONLY if we just created the table
        const roles = [
            {
                name: 'Super Admin',
                description: 'Full system access with all permissions',
                permissions: JSON.stringify({ all: true })
            },
            {
                name: 'Manager',
                description: 'Manage students, bookings, and reports',
                permissions: JSON.stringify({ students: ['view', 'edit'], bookings: ['view', 'edit'], reports: ['view'] })
            },
            {
                name: 'Counselor',
                description: 'Handle student enquiries and counseling',
                permissions: JSON.stringify({ enquiries: ['view', 'reply'], counseling: ['view', 'edit'] })
            },
            {
                name: 'Expert',
                description: 'Provide specialized guidance to students',
                permissions: JSON.stringify({ guidance: ['view', 'edit'] })
            },
            {
                name: 'Finance',
                description: 'Manage payments and financial operations',
                permissions: JSON.stringify({ payments: ['view', 'process'], invoices: ['view', 'create'] })
            }
        ];

        await knex('roles').insert(roles);
    }

    // Add role_id to users
    const hasRoleId = await knex.schema.hasColumn('users', 'role_id');
    if (!hasRoleId) {
        await knex.schema.table('users', (table) => {
            table.uuid('role_id').nullable().references('id').inTable('roles').onDelete('SET NULL');
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    const hasRoleId = await knex.schema.hasColumn('users', 'role_id');
    if (hasRoleId) {
        await knex.schema.table('users', (table) => {
            table.dropColumn('role_id');
        });
    }
    await knex.schema.dropTableIfExists('roles');
};
