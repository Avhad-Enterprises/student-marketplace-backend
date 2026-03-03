exports.up = async function (knex) {
  // Add updated_at columns if they do not exist
  await knex.schema.hasTable('activities').then(async (exists) => {
    if (exists) {
      const has = await knex.schema.hasColumn('activities', 'updated_at');
      if (!has) {
        await knex.schema.alterTable('activities', (t) => {
          t.timestamp('updated_at').defaultTo(knex.fn.now());
        });
      }
    }
  });

  await knex.schema.hasTable('communications').then(async (exists) => {
    if (exists) {
      const has = await knex.schema.hasColumn('communications', 'updated_at');
      if (!has) {
        await knex.schema.alterTable('communications', (t) => {
          t.timestamp('updated_at').defaultTo(knex.fn.now());
        });
      }
    }
  });
};

exports.down = async function (knex) {
  await knex.schema.hasTable('activities').then(async (exists) => {
    if (exists) {
      const has = await knex.schema.hasColumn('activities', 'updated_at');
      if (has) {
        await knex.schema.alterTable('activities', (t) => {
          t.dropColumn('updated_at');
        });
      }
    }
  });

  await knex.schema.hasTable('communications').then(async (exists) => {
    if (exists) {
      const has = await knex.schema.hasColumn('communications', 'updated_at');
      if (has) {
        await knex.schema.alterTable('communications', (t) => {
          t.dropColumn('updated_at');
        });
      }
    }
  });
};
