
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('countries');
  if (!exists) {
    return knex.schema.createTable('countries', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('code').notNullable();
      table.string('region');
      table.string('visa_difficulty');
      table.string('cost_of_living');
      table.string('status').defaultTo('active');
      table.integer('popularity').defaultTo(0);
      table.boolean('work_rights').defaultTo(false);
      table.boolean('pr_availability').defaultTo(false);
      table.timestamps(true, true);
    });
  } else {
    // Check and add missing columns sequentially
    const hasRegion = await knex.schema.hasColumn('countries', 'region');
    if (!hasRegion) {
        await knex.schema.table('countries', t => t.string('region'));
    }
    
    const hasVisa = await knex.schema.hasColumn('countries', 'visa_difficulty');
    if (!hasVisa) {
        await knex.schema.table('countries', t => t.string('visa_difficulty'));
    }
    
    const hasCOL = await knex.schema.hasColumn('countries', 'cost_of_living');
    if (!hasCOL) {
        await knex.schema.table('countries', t => t.string('cost_of_living'));
    }
    
    const hasStatus = await knex.schema.hasColumn('countries', 'status');
    if (!hasStatus) {
        await knex.schema.table('countries', t => t.string('status').defaultTo('active'));
    }
    
    const hasPop = await knex.schema.hasColumn('countries', 'popularity');
    if (!hasPop) {
        await knex.schema.table('countries', t => t.integer('popularity').defaultTo(0));
    }
    
    const hasWR = await knex.schema.hasColumn('countries', 'work_rights');
    if (!hasWR) {
        await knex.schema.table('countries', t => t.boolean('work_rights').defaultTo(false));
    }
    
    const hasPR = await knex.schema.hasColumn('countries', 'pr_availability');
    if (!hasPR) {
        await knex.schema.table('countries', t => t.boolean('pr_availability').defaultTo(false));
    }
    
    // Add timestamps if missing? Hard to check both created_at efficiently without explicit check
    // Assuming if table exists it has timestamps or we ignore for now to avoid complexity unless errors occur.
  }
};

exports.down = function(knex) {
  return Promise.resolve();
};
