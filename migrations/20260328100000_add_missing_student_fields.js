/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const table = 'students';
  const columns = [
    { name: 'student_intent', type: 'string' },
    { name: 'interested_services', type: 'jsonb' },
    { name: 'communication_preference', type: 'string' },
    { name: 'timezone', type: 'string' }
  ];

  for (const col of columns) {
    const hasCol = await knex.schema.hasColumn(table, col.name);
    if (!hasCol) {
        await knex.schema.table(table, t => {
          if (col.type === 'string') t.string(col.name);
          else if (col.type === 'jsonb') t.jsonb(col.name);
        });
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const table = 'students';
  const columns = ['student_intent', 'interested_services', 'communication_preference', 'timezone'];

  for (const col of columns) {
    const hasCol = await knex.schema.hasColumn(table, col);
    if (hasCol) {
        await knex.schema.table(table, t => t.dropColumn(col));
    }
  }
};
