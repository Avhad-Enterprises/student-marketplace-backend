/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const exists = await knex.schema.hasTable('sop_assistant_settings');
    if (exists) return;

    return knex.schema.createTable('sop_assistant_settings', table => {
        table.increments('id').primary();
        table.string('model_provider').notNullable().defaultTo('openai');
        table.string('model_version').notNullable().defaultTo('gpt-4o');
        table.text('system_prompt').notNullable().defaultTo('You are a professional Statement of Purpose (SOP) reviewer. Analyze the provided SOP for clarity, tone, structure, and impact. Provide a confidence score and detailed feedback.');
        table.integer('confidence_threshold').notNullable().defaultTo(70);
        table.boolean('auto_approval').notNullable().defaultTo(false);
        table.integer('max_tokens').notNullable().defaultTo(2000);
        table.float('temperature').notNullable().defaultTo(0.5);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    }).then(() => {
        // Insert default settings
        return knex('sop_assistant_settings').insert({
            model_provider: 'openai',
            model_version: 'gpt-4o',
            system_prompt: 'You are a professional Statement of Purpose (SOP) reviewer. Analyze the provided SOP for clarity, tone, structure, and impact. Provide a confidence score and detailed feedback.',
            confidence_threshold: 70,
            auto_approval: false,
            max_tokens: 2000,
            temperature: 0.5
        });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('sop_assistant_settings');
};
