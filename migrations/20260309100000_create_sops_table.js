/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('sops', table => {
        table.increments('id').primary();
        table.string('student_name').notNullable();
        table.string('country').notNullable();
        table.string('university').notNullable();
        table.string('review_status').defaultTo('Draft');
        table.string('ai_confidence_score').defaultTo('0%');
        table.string('status').defaultTo('active');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('sops');
};
