exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const columnsToUpdate = [
      { name: "tuition_fees", type: "decimal", precision: 12, scale: 2 },
      { name: "living_cost", type: "decimal", precision: 12, scale: 2 },
      { name: "total_annual_cost", type: "decimal", precision: 12, scale: 2 },
      { name: "financial_aid_details", type: "text" }
    ];

    for (const col of columnsToUpdate) {
      const hasCol = await knex.schema.hasColumn("universities", col.name);
      if (!hasCol) {
        await knex.schema.table("universities", table => {
          if (col.type === "decimal") table.decimal(col.name, col.precision, col.scale);
          else if (col.type === "text") table.text(col.name);
        });
      }
    }
  }
};

exports.down = function(knex) { return Promise.resolve(); };
