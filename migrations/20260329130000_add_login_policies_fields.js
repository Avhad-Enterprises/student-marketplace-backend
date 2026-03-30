/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const table = 'system_settings';
    
    // List of additional Login Policy columns
    const columns = [
        { name: 'max_login_attempts', type: 'integer', default: 5 },
        { name: 'lockout_duration_minutes', type: 'integer', default: 30 },
        { name: 'allow_concurrent_sessions', type: 'boolean', default: true },
        { name: 'enable_sso', type: 'boolean', default: false },
        { name: 'enable_google_login', type: 'boolean', default: true }
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
    const columns = [
        'max_login_attempts', 
        'lockout_duration_minutes', 
        'allow_concurrent_sessions', 
        'enable_sso', 
        'enable_google_login'
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
