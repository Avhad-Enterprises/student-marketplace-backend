/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const table = 'students';
    const columns = [
        { name: 'highest_qualification', type: 'string' },
        { name: 'field_of_study', type: 'string' },
        { name: 'current_institution', type: 'string' },
        { name: 'graduation_year', type: 'string' },
        { name: 'gpa', type: 'string' },
        { name: 'first_touch_date', type: 'date' },
        { name: 'conversion_path_summary', type: 'text' },
        { name: 'preferred_course_level', type: 'string' },
        { name: 'budget_range', type: 'string' },
        { name: 'intake_preference', type: 'string' },
        { name: 'test_scores', type: 'string' }
    ];

    for (const col of columns) {
        const hasColumn = await knex.schema.hasColumn(table, col.name);
        if (!hasColumn) {
            await knex.schema.table(table, t => {
                if (col.type === 'string') t.string(col.name);
                else if (col.type === 'text') t.text(col.name);
                else if (col.type === 'date') t.date(col.name);
            });
        }
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    const table = 'students';
    const columns = [
        'highest_qualification', 'field_of_study', 'current_institution', 'graduation_year', 'gpa',
        'first_touch_date', 'conversion_path_summary',
        'preferred_course_level', 'budget_range', 'intake_preference', 'test_scores'
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
