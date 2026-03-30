/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const table = 'system_settings';
    
    const columns = [
        { name: 'manual_admin_approval', type: 'boolean', default: false },
        { name: 'auto_approve_hours', type: 'integer', default: 24 },
        { name: 'verification_expiry_days', type: 'integer', default: 30 }
    ];

    for (const col of columns) {
        const hasColumn = await knex.schema.hasColumn(table, col.name);
        if (!hasColumn) {
            await knex.schema.table(table, t => {
                let column;
                if (col.type === 'integer') column = t.integer(col.name);
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
    const columns = ['manual_admin_approval', 'auto_approve_hours', 'verification_expiry_days'];

    for (const col of columns) {
        const hasColumn = await knex.schema.hasColumn(table, col);
        if (hasColumn) {
            await knex.schema.table(table, t => {
                t.dropColumn(col);
            });
        }
    }
};
