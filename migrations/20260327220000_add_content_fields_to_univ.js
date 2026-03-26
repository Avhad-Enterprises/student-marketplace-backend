exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const newCols = [
      "overview", "academic_programs_content", "admissions_content",
      "financial_aid_content", "campus_life_content", "career_outcomes_content", "research_content"
    ];
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
