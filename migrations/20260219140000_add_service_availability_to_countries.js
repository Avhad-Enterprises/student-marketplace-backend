
exports.up = async function (knex) {
    const services = [
        'service_visa',
        'service_insurance',
        'service_housing',
        'service_loans',
        'service_forex',
        'service_courses',
        'service_food',
    ];

    for (const col of services) {
        const hasCol = await knex.schema.hasColumn('countries', col);
        if (!hasCol) {
            await knex.schema.table('countries', (table) => {
                table.boolean(col).defaultTo(false);
            });
        }
    }
};

exports.down = async function (knex) {
    const services = [
        'service_visa',
        'service_insurance',
        'service_housing',
        'service_loans',
        'service_forex',
        'service_courses',
        'service_food',
    ];

    for (const col of services) {
        const hasCol = await knex.schema.hasColumn('countries', col);
        if (hasCol) {
            await knex.schema.table('countries', (table) => {
                table.dropColumn(col);
            });
        }
    }
};
