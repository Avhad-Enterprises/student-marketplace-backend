exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const hasRatio = await knex.schema.hasColumn("universities", "student_faculty_ratio");
    if (!hasRatio) {
      await knex.schema.table("universities", table => {
        table.string("student_faculty_ratio");
      });
    }
    const hasPrograms = await knex.schema.hasColumn("universities", "popular_programs");
    if (!hasPrograms) {
      await knex.schema.table("universities", table => {
        table.jsonb("popular_programs").defaultTo("[]");
      });
    }
    const hasIntlPerc = await knex.schema.hasColumn("universities", "international_students_percentage");
    if (!hasIntlPerc) {
      await knex.schema.table("universities", table => {
        table.decimal("international_students_percentage", 5, 2);
      });
    }
  }
};

exports.down = function(knex) { return Promise.resolve(); };
