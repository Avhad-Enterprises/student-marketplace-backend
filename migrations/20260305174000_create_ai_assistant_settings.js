/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('ai_assistant_settings', table => {
        table.increments('id').primary();
        table.string('assistant_name').notNullable().defaultTo('Study Abroad Visa Assistant');
        table.string('tagline').defaultTo('Your intelligent companion for visa guidance');
        table.string('default_language').defaultTo('en');
        table.string('model_provider').defaultTo('openai');
        table.string('model_version').defaultTo('gpt-4-turbo');
        table.float('temperature').defaultTo(0.7);
        table.string('response_length').defaultTo('medium');
        table.string('memory_window').defaultTo('8k');
        table.boolean('streaming').defaultTo(true);
        table.integer('timeout').defaultTo(30);
        table.integer('retry_attempts').defaultTo(3);
        table.string('tone').defaultTo('friendly');
        table.string('answer_style').defaultTo('detailed');
        table.string('communication_style').defaultTo('conversational');
        table.integer('confidence_threshold').defaultTo(60);
        table.string('confidence_visibility').defaultTo('internal');
        table.string('escalation_action').defaultTo('show-button');
        table.text('welcome_message').defaultTo("Hello! I'm your Study Abroad Visa Assistant. How can I help you today?");
        table.jsonb('guardrails').defaultTo(JSON.stringify({
            noLegalAdvice: true,
            noGuaranteedApproval: true,
            noFinancialGuarantee: true,
            noImmigrationConsultancy: true,
            noPolicyInterpretation: true
        }));
        table.jsonb('escalation_triggers').defaultTo(JSON.stringify({
            lowConfidence: true,
            userRequestsHuman: true,
            cannotAnswer: true,
            negativeSentiment: true
        }));
        table.jsonb('formatting_rules').defaultTo(JSON.stringify({
            alwaysDisclaimer: true,
            showChecklistTable: true,
            countryLinks: true,
            estimatedTime: true,
            ctaButton: true
        }));
        table.string('status').defaultTo('online');
        table.boolean('strict_mode').defaultTo(true);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('ai_assistant_settings');
};
