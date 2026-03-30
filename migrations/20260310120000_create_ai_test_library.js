/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const exists = await knex.schema.hasTable('ai_test_library');
    if (exists) return;

    return knex.schema.createTable('ai_test_library', table => {
        table.increments('id').primary();
        table.string('item_id').unique().notNullable();
        table.string('title').notNullable();
        table.string('exam').notNullable();
        table.string('difficulty');
        table.string('topic');
        table.string('type');
        table.boolean('transcript').defaultTo(false);
        table.jsonb('sections_included');
        table.string('duration');
        table.string('status').defaultTo('Draft');
        table.integer('usage_30d').defaultTo(0);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('ai_test_library');
};
