/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const table = 'system_settings';
    
    const columns = [
        // Document Access Rules
        { name: 'document_access_roles', type: 'text' },
        { name: 'mask_sensitive_documents', type: 'boolean', default: true },
        { name: 'allow_document_download', type: 'boolean', default: true },
        { name: 'watermark_documents', type: 'boolean', default: true },
        
        // KYC Settings
        { name: 'kyc_required_booking', type: 'boolean', default: true },
        { name: 'kyc_required_loan', type: 'boolean', default: true },
        { name: 'kyc_required_visa', type: 'boolean', default: true },
        { name: 'kyc_document_types', type: 'text' },
        
        // Data Visibility
        { name: 'hide_phone_from_experts', type: 'boolean', default: true },
        { name: 'hide_email_from_counselors', type: 'boolean', default: false },
        { name: 'allow_cross_department_access', type: 'boolean', default: false },
        { name: 'log_identity_changes', type: 'boolean', default: true }
    ];

    for (const col of columns) {
        const hasColumn = await knex.schema.hasColumn(table, col.name);
        if (!hasColumn) {
            await knex.schema.table(table, t => {
                let column;
                if (col.type === 'integer') column = t.integer(col.name);
                else if (col.type === 'boolean') column = t.boolean(col.name);
                else if (col.type === 'text') column = t.text(col.name);
                else if (col.type === 'string') column = t.string(col.name);
                
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
        'document_access_roles', 'mask_sensitive_documents', 'allow_document_download', 'watermark_documents',
        'kyc_required_booking', 'kyc_required_loan', 'kyc_required_visa', 'kyc_document_types',
        'hide_phone_from_experts', 'hide_email_from_counselors', 'allow_cross_department_access', 'log_identity_changes'
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
