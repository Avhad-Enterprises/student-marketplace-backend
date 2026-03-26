exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const columnsToUpdate = [
      { name: "research_funding", type: "decimal", precision: 15, scale: 2 },
      { name: "campus_size", type: "string" },
      { name: "employment_rate", type: "decimal", precision: 5, scale: 2 },
      { name: "average_starting_salary", type: "decimal", precision: 12, scale: 2 }
    ];

    for (const col of columnsToUpdate) {
      const hasCol = await knex.schema.hasColumn("universities", col.name);
      if (!hasCol) {
        await knex.schema.table("universities", table => {
          if (col.type === "decimal") table.decimal(col.name, col.precision, col.scale);
          else if (col.type === "string") table.string(col.name);
        });
      }
    }
  }
};

exports.down = function(knex) { return Promise.resolve(); };
