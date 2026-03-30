/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const table = 'localization_settings';
    
    // Create table if it doesn't exist
    const exists = await knex.schema.hasTable(table);
    if (!exists) {
        await knex.schema.createTable(table, t => {
            t.increments('id').primary();
            
            // Language Settings
            t.string('default_language', 100).defaultTo('English');
            t.string('fallback_language', 100).defaultTo('English');
            t.boolean('enable_multi_language').defaultTo(true);
            t.boolean('auto_detect_language').defaultTo(true);
            t.boolean('enable_rtl_support').defaultTo(false);
            t.text('supported_languages').defaultTo('["English", "Spanish", "French"]'); // JSON string array
            
            // Timezone & Date Format
            t.string('default_timezone', 100).defaultTo('UTC');
            t.string('date_format', 100).defaultTo('MM/DD/YYYY (US)');
            t.string('time_format', 100).defaultTo('12-hour (1:30 PM)');
            t.string('first_day_of_week', 100).defaultTo('Sunday');
            t.boolean('auto_timezone_detection').defaultTo(true);
            
            // Regional Operations
            t.string('primary_region', 100).defaultTo('North America');
            t.boolean('region_based_pricing').defaultTo(false);
            t.boolean('region_based_content').defaultTo(true);
            t.boolean('regional_compliance_mode').defaultTo(true);
            t.text('operating_regions').defaultTo('["North America", "Europe"]'); // JSON string array
            
            // Regional Formatting
            t.string('number_format', 100).defaultTo('US (1,234.56)');
            t.string('phone_number_format', 100).defaultTo('International (+1-555-123-4567)');
            t.string('address_format', 100).defaultTo('US Format');
            t.string('name_format', 100).defaultTo('First Last (Western)');
            t.string('decimal_separator', 50).defaultTo('Period (.)');
            t.string('thousands_separator', 50).defaultTo('Comma (,)');
            
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
    await knex.schema.dropTableIfExists('localization_settings');
};
