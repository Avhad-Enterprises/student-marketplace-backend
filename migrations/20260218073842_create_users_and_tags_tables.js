/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Ensure uuid-ossp extension exists for UUID generation
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create users table
    await knex.schema.createTable('users', (table) => {
        // Identity
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('user_type', 30).notNullable(); // student, counselor, admin
        table.string('student_code', 30).unique().nullable();

        // Name & Basic Contact
        table.string('first_name', 100).notNullable();
        table.string('middle_name', 100).nullable();
        table.string('last_name', 100).nullable();
        table.string('full_name', 255).nullable();
        table.string('email', 255).unique().nullable();
        table.string('phone_country_code', 10).nullable();
        table.string('phone_number', 30).nullable();
        table.string('phone_e164', 20).unique().nullable();

        // Account Status
        table.string('account_status', 30).defaultTo('pending_verification'); // active, inactive, blocked, pending_verification, archived
        table.timestamp('status_updated_at').nullable();
        table.uuid('status_updated_by').nullable(); // FK to users.id (self)

        // Authentication
        table.text('password_hash').nullable();
        table.string('auth_provider', 30).notNullable(); // email_password, google, apple, phone_otp, sso
        table.string('auth_provider_id', 255).nullable();
        table.timestamp('last_login_at').nullable();
        table.integer('login_count').defaultTo(0);
        table.integer('failed_login_attempts').defaultTo(0);
        table.timestamp('locked_until').nullable();

        // Verification
        table.boolean('email_verified').defaultTo(false);
        table.timestamp('email_verified_at').nullable();
        table.boolean('phone_verified').defaultTo(false);
        table.timestamp('phone_verified_at').nullable();

        // Demographics
        table.date('date_of_birth').nullable();
        table.string('gender', 30).nullable();
        table.string('nationality_country_code', 2).nullable();
        table.string('current_country_code', 2).nullable();
        table.string('current_city', 120).nullable();
        table.string('timezone', 64).nullable();
        table.string('preferred_language', 10).nullable();
        table.text('avatar_url').nullable();

        // Compliance, Audit, Soft Delete
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.uuid('created_by').nullable(); // FK to users.id
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.uuid('updated_by').nullable(); // FK to users.id
        table.timestamp('deleted_at').nullable();
        table.uuid('deleted_by').nullable(); // FK to users.id
        table.boolean('is_deleted').defaultTo(false);
    });

    // Create tags table
    await knex.schema.createTable('tags', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('tenant_id').nullable();
        table.string('tag_name', 120).notNullable();
        table.string('tag_type', 60).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('tags');
    await knex.schema.dropTableIfExists('users');
};
