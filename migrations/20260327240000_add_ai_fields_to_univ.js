exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const newCols = [
      { name: "prestige_level", type: "string" },
      { name: "tags", type: "text" }
    ];
    for (const col of newCols) {
      const hasCol = await knex.schema.hasColumn("universities", col.name);
      if (!hasCol) {
        await knex.schema.table("universities", table => {
          if (col.type === "string") table.string(col.name);
          else table.text(col.name);
        });
      }
    }
  }
};
exports.down = function(knex) { return Promise.resolve(); };
