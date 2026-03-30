/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const table = 'integration_settings';
    
    // Create table if it doesn't exist
    const exists = await knex.schema.hasTable(table);
    if (!exists) {
        await knex.schema.createTable(table, t => {
            t.increments('id').primary();
            
            // API Access & Keys
            t.boolean('enable_public_api').defaultTo(true);
            t.string('api_key', 255).defaultTo('sk_test_51Mz...');
            t.string('api_key_rotation', 50).defaultTo('Manual');
            t.integer('api_key_expiry_days').defaultTo(90);
            t.integer('api_rate_limit').defaultTo(1000);
            t.text('allowed_ip_whitelist').defaultTo('192.168.1.1, 10.0.0.1');
            
            // Webhook Configuration
            t.boolean('enable_webhooks').defaultTo(true);
            t.string('webhook_endpoint_url', 255).defaultTo('https://api.example.com/webhooks');
            t.string('webhook_secret_key', 255).defaultTo('whsec_...');
            t.string('webhook_retry_policy', 100).defaultTo('Exponential Backoff');
            t.text('webhook_events').defaultTo('["Student Created", "Payment Completed"]'); // JSON string array
            
            // Third-Party & Service Providers
            t.string('integration_provider', 100).defaultTo('Stripe');
            t.string('integration_credentials', 255).defaultTo('');
            t.string('ai_service_provider', 100).defaultTo('OpenAI GPT-4');
            t.string('file_storage_provider', 100).defaultTo('AWS S3');
            t.string('search_engine_provider', 100).defaultTo('Elasticsearch');
            t.string('notification_service_provider', 100).defaultTo('SendGrid');
            
            // Data Import / Export
            t.boolean('allow_csv_import').defaultTo(true);
            t.boolean('allow_bulk_data_export').defaultTo(true);
            t.boolean('enable_scheduled_data_sync').defaultTo(false);
            t.string('export_format', 50).defaultTo('CSV');
            
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
    await knex.schema.dropTableIfExists('integration_settings');
};
