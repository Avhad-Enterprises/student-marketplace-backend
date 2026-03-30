/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const table = 'compliance_settings';
    
    // Create table if it doesn't exist
    const exists = await knex.schema.hasTable(table);
    if (!exists) {
        await knex.schema.createTable(table, t => {
            t.increments('id').primary();
            
            // Data Protection Rules
            t.boolean('gdpr_mode').defaultTo(true);
            t.boolean('ccpa_mode').defaultTo(false);
            t.boolean('right_to_be_forgotten').defaultTo(true);
            t.boolean('data_portability').defaultTo(true);
            t.integer('data_retention_period').defaultTo(365);
            t.boolean('anonymize_deleted').defaultTo(true);
            
            // Consent & Privacy
            t.boolean('require_explicit_consent').defaultTo(true);
            t.boolean('cookie_consent').defaultTo(true);
            t.boolean('marketing_opt_in').defaultTo(true);
            t.boolean('age_verification_required').defaultTo(false);
            t.string('privacy_policy_url', 255).defaultTo('https://example.com/privacy');
            t.integer('minimum_age').defaultTo(16);
            
            // Document Compliance
            t.boolean('document_encryption').defaultTo(true);
            t.boolean('document_watermarking').defaultTo(false);
            t.boolean('version_control').defaultTo(true);
            t.boolean('compliance_tagging').defaultTo(true);
            t.integer('document_retention_years').defaultTo(7);
            t.boolean('automatic_expiry').defaultTo(true);
            
            // Audit & Activity Logs
            t.boolean('enable_audit_logging').defaultTo(true);
            t.boolean('log_data_access').defaultTo(true);
            t.boolean('log_data_modifications').defaultTo(true);
            t.boolean('log_user_authentication').defaultTo(true);
            t.integer('audit_log_retention_days').defaultTo(730);
            t.boolean('real_time_alerts').defaultTo(true);
            
            // Regulatory Modes
            t.string('primary_framework', 100).defaultTo('GDPR (European Union)');
            t.string('data_residency', 100).defaultTo('European Union');
            t.boolean('soc2_compliance').defaultTo(false);
            t.boolean('iso27001_compliance').defaultTo(false);
            t.boolean('hipaa_compliance').defaultTo(false);
            
            t.timestamps(true, true);
        });
    }

    // Ensure initial record exists
    const hasRecord = await knex(table).where('id', 1).first();
    if (!hasRecord) {
        await knex(table).insert({ id: 1 });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('compliance_settings');
};
