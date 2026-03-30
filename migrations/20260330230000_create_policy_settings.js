/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // 1. Global Policy Settings
    const globalTable = 'policy_global_settings';
    const hasGlobal = await knex.schema.hasTable(globalTable);
    if (!hasGlobal) {
        await knex.schema.createTable(globalTable, t => {
            t.increments('id').primary();
            t.boolean('enable_reacceptance').defaultTo(true);
            t.boolean('enable_consent_timestamp').defaultTo(true);
            t.integer('log_retention_months').defaultTo(24);
            t.string('legal_contact_email', 255).defaultTo('legal@example.com');
            t.timestamps(true, true);
        });
        // Initial record
        await knex(globalTable).insert({ id: 1 });
    }

    // 2. Policy Pages repository
    const pagesTable = 'policy_pages';
    const hasPages = await knex.schema.hasTable(pagesTable);
    if (!hasPages) {
        await knex.schema.createTable(pagesTable, t => {
            t.increments('id').primary();
            t.string('title', 255).notNullable();
            t.string('slug', 255).unique();
            t.string('type', 100).notNullable(); // badge: Terms, Privacy etc.
            t.string('status', 50).defaultTo('Published'); // badge: Published, Draft
            t.string('version', 20).defaultTo('v1.0');
            t.date('effective_date');
            t.string('visibility', 50).defaultTo('Public');
            t.text('content');
            t.string('author_name', 100);
            t.timestamp('last_updated_at').defaultTo(knex.fn.now());
            t.timestamps(true, true);
        });

        // Insert some initial policy pages for better demonstration
        await knex(pagesTable).insert([
            {
                title: 'Terms & Conditions',
                slug: '/terms-and-conditions',
                type: 'Terms & Conditions',
                status: 'Published',
                version: 'v2.1',
                effective_date: '2024-02-12',
                visibility: 'Public',
                author_name: 'Admin User'
            },
            {
                title: 'Privacy Policy',
                slug: '/privacy-policy',
                type: 'Privacy Policy',
                status: 'Published',
                version: 'v1.8',
                effective_date: '2024-01-15',
                visibility: 'Public',
                author_name: 'Legal Team'
            },
            {
                title: 'Refund Policy',
                slug: '/refund-policy',
                type: 'Refund Policy',
                status: 'Draft',
                version: 'v1.0',
                effective_date: '2024-03-01',
                visibility: 'Public',
                author_name: 'Finance Team'
            }
        ]);
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('policy_pages');
    await knex.schema.dropTableIfExists('policy_global_settings');
};
