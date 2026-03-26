exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const hasNationalRank = await knex.schema.hasColumn("universities", "national_ranking");
    if (!hasNationalRank) {
      await knex.schema.table("universities", table => {
        table.string("national_ranking");
      });
    }
    const hasLocationText = await knex.schema.hasColumn("universities", "location");
    if (!hasLocationText) {
      await knex.schema.table("universities", table => {
        table.text("location");
      });
    }
  }
};

exports.down = function(knex) { return Promise.resolve(); };
