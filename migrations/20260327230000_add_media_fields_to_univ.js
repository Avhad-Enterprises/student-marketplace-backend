exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const newCols = ["university_logo", "university_banner"];
    for (const col of newCols) {
      const hasCol = await knex.schema.hasColumn("universities", col);
      if (!hasCol) {
        await knex.schema.table("universities", table => {
          table.text(col);
        });
      }
    }
  }
};
exports.down = function(knex) { return Promise.resolve(); };
