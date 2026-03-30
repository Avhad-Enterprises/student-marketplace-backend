/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const table = 'system_settings';
    
    // List of all configuration columns to add
    const columns = [
        { name: 'legal_entity_name', type: 'string' },
        { name: 'organization_type', type: 'string' },
        { name: 'support_phone', type: 'string' },
        { name: 'timezone', type: 'string' },
        { name: 'registered_address', type: 'text' },
        { name: 'tax_id', type: 'string' },
        { name: 'registration_number', type: 'string' },
        { name: 'country_of_registration', type: 'string' },
        { name: 'logo_light', type: 'text' },
        { name: 'logo_dark', type: 'text' },
        { name: 'favicon', type: 'text' },
        { name: 'primary_color', type: 'string' },
        { name: 'accent_color', type: 'string' },
        { name: 'email_logo', type: 'text' },
        { name: 'primary_domain', type: 'string' },
        { name: 'subdomain', type: 'string' },
        { name: 'staging_domain', type: 'string' },
        { name: 'environment', type: 'string', default: 'production' },
        { name: 'maintenance_mode', type: 'boolean', default: false },
        { name: 'invoice_footer', type: 'text' },
        { name: 'multi_country_mode', type: 'boolean', default: false },
        { name: 'multi_service_mode', type: 'boolean', default: true },
        { name: 'allow_guest_enquiries', type: 'boolean', default: true },
        { name: 'require_email_verification', type: 'boolean', default: true },
        { name: 'require_phone_verification', type: 'boolean', default: false },
        { name: 'password_min_length', type: 'integer', default: 8 },
        { name: 'force_password_reset_days', type: 'integer', default: 90 },
        { name: 'session_timeout_minutes', type: 'integer', default: 30 },
        { name: 'require_special_chars', type: 'boolean', default: true },
        { name: 'two_factor_required', type: 'boolean', default: false },
        { name: 'ip_whitelist', type: 'text' }
    ];

    for (const col of columns) {
        const hasColumn = await knex.schema.hasColumn(table, col.name);
        if (!hasColumn) {
            await knex.schema.table(table, t => {
                let column;
                if (col.type === 'string') column = t.string(col.name);
                else if (col.type === 'text') column = t.text(col.name);
                else if (col.type === 'integer') column = t.integer(col.name);
                else if (col.type === 'boolean') column = t.boolean(col.name);
                
                if (col.default !== undefined) {
                    column.defaultTo(col.default);
                }
                column.nullable();
            });
        }
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    const table = 'system_settings';
    const columns = [
        'legal_entity_name', 'organization_type', 'support_phone', 'timezone', 
        'registered_address', 'tax_id', 'registration_number', 'country_of_registration',
        'logo_light', 'logo_dark', 'favicon', 'primary_color', 'accent_color', 'email_logo',
        'primary_domain', 'subdomain', 'staging_domain', 'environment', 'maintenance_mode',
        'invoice_footer', 'multi_country_mode', 'multi_service_mode', 'allow_guest_enquiries',
        'require_email_verification', 'require_phone_verification',
        'password_min_length', 'force_password_reset_days', 'session_timeout_minutes',
        'require_special_chars', 'two_factor_required', 'ip_whitelist'
    ];

    for (const col of columns) {
        const hasColumn = await knex.schema.hasColumn(table, col);
        if (hasColumn) {
            await knex.schema.table(table, t => {
                t.dropColumn(col);
            });
        }
    }
};
