exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const columnsToUpdate = [
      { name: "undergraduate_duration", type: "decimal", precision: 5, scale: 2 },
      { name: "undergraduate_credits", type: "decimal", precision: 8, scale: 2 },
      { name: "graduate_duration", type: "decimal", precision: 5, scale: 2 },
      { name: "graduate_programs", type: "jsonb" }
    ];

    for (const col of columnsToUpdate) {
      const hasCol = await knex.schema.hasColumn("universities", col.name);
      if (!hasCol) {
        await knex.schema.table("universities", table => {
          if (col.type === "decimal") table.decimal(col.name, col.precision, col.scale);
          else if (col.type === "jsonb") table.jsonb(col.name).defaultTo("[]");
        });
      }
    }
  }
};

exports.down = function(knex) { return Promise.resolve(); };
