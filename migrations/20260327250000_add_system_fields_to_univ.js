exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const newCols = [
      { name: "is_featured", type: "boolean" },
      { name: "display_order", type: "integer" },
      { name: "meta_title", type: "string" },
      { name: "meta_description", type: "text" }
    ];
    for (const col of newCols) {
      const hasCol = await knex.schema.hasColumn("universities", col.name);
      if (!hasCol) {
        await knex.schema.table("universities", table => {
          if (col.type === "boolean") table.boolean(col.name).defaultTo(false);
          else if (col.type === "integer") table.integer(col.name).defaultTo(0);
          else if (col.type === "string") table.string(col.name);
          else table.text(col.name);
        });
      }
    }
  }
};
exports.down = function(knex) { return Promise.resolve(); };
