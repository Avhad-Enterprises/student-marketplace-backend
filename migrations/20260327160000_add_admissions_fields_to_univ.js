exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const hasAvgGPA = await knex.schema.hasColumn("universities", "avg_gpa");
    if (!hasAvgGPA) {
      await knex.schema.table("universities", table => {
        table.string("avg_gpa");
      });
    }
    const hasEnglishReq = await knex.schema.hasColumn("universities", "english_requirement");
    if (!hasEnglishReq) {
      await knex.schema.table("universities", table => {
        table.text("english_requirement");
      });
    }
    const hasDeadline = await knex.schema.hasColumn("universities", "application_deadline");
    if (!hasDeadline) {
      await knex.schema.table("universities", table => {
        table.date("application_deadline");
      });
    }
  }
};

exports.down = function(knex) { return Promise.resolve(); };
