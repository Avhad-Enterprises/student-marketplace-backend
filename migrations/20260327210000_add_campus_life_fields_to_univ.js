exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const columnsToUpdate = [
      { name: "varsity_sports_count", type: "integer" },
      { name: "on_campus_living_percentage", type: "decimal", precision: 5, scale: 2 },
      { name: "countries_represented", type: "integer" }
    ];

    for (const col of columnsToUpdate) {
      const hasCol = await knex.schema.hasColumn("universities", col.name);
      if (!hasCol) {
        await knex.schema.table("universities", table => {
          if (col.type === "integer") table.integer(col.name);
          else if (col.type === "decimal") table.decimal(col.name, col.precision, col.scale);
        });
      }
    }
  }
};

exports.down = function(knex) { return Promise.resolve(); };
