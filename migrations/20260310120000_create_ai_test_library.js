/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('ai_test_library', function (table) {
        table.increments('id').primary();
        table.string('item_id', 50).unique().notNullable();
        table.string('title', 255).notNullable();
        table.string('exam', 100).notNullable();
        table.string('difficulty', 50);
        table.string('topic', 100);
        table.string('type', 100);
        table.boolean('transcript').defaultTo(false);
        table.jsonb('sections_included');
        table.string('duration', 50);
        table.string('status', 50).defaultTo('Draft');
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
    return knex.schema.dropTable('ai_test_library');
};
