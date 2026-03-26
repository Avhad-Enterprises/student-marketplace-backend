exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (!exists) {
    return knex.schema.createTable("universities", function(table) {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("country");
      table.string("city");
      table.string("logo_url");
      table.string("website");
      table.string("status").defaultTo("active");
      table.timestamps(true, true);
    });
  }

  const columns = [
    { name: "world_ranking", type: "integer" },
    { name: "global_score", type: "float" },
    { name: "location_type", type: "string" },
    { name: "campus_size", type: "string" },
    { name: "established_year", type: "integer" },
    { name: "university_type", type: "string" },
    { name: "acceptance_rate", type: "float" },
    { name: "application_deadline_fall", type: "string" },
    { name: "application_deadline_spring", type: "string" },
    { name: "application_fee", type: "decimal", precision: 10, scale: 2 },
    { name: "min_gpa", type: "float" },
    { name: "min_ielts", type: "float" },
    { name: "min_toefl", type: "integer" },
    { name: "total_students", type: "integer" },
    { name: "international_students", type: "integer" },
    { name: "international_ratio", type: "float" },
    { name: "gender_ratio", type: "string" },
    { name: "tuition_fees_min", type: "decimal", precision: 12, scale: 2 },
    { name: "tuition_fees_max", type: "decimal", precision: 12, scale: 2 },
    { name: "living_cost_min", type: "decimal", precision: 10, scale: 2 },
    { name: "living_cost_max", type: "decimal", precision: 10, scale: 2 },
    { name: "financial_aid_available", type: "boolean", default: false },
    { name: "scholarships_info", type: "text" },
    { name: "research_rating", type: "string" },
    { name: "graduate_outcome_rate", type: "float" },
    { name: "top_recruiters", type: "jsonb" },
    { name: "career_services", type: "text" },
    { name: "degree_levels", type: "jsonb" },
    { name: "credit_system", type: "string" },
    { name: "internship_available", type: "boolean", default: false },
    { name: "industry_partners", type: "jsonb" },
    { name: "campus_facilities", type: "jsonb" },
    { name: "student_orgs_count", type: "integer" },
    { name: "housing_available", type: "boolean", default: false },
    { name: "housing_types", type: "text" },
    { name: "description", type: "text" },
    { name: "key_facts", type: "jsonb" },
    { name: "pros", type: "jsonb" },
    { name: "cons", type: "jsonb" },
    { name: "hero_image", type: "string" },
    { name: "video_tour_url", type: "string" },
    { name: "gallery_images", type: "jsonb" },
    { name: "ai_context_summary", type: "text" },
    { name: "key_selling_points", type: "jsonb" },
    { name: "roi_rating", type: "string" },
    { name: "slug", type: "string" },
    { name: "application_status", type: "string", default: "open" },
    { name: "visible", type: "boolean", default: true },
    { name: "admin_notes", type: "text" },
    { name: "country_id", type: "integer" }
  ];

  for (const col of columns) {
    const hasCol = await knex.schema.hasColumn("universities", col.name);
    if (!hasCol) {
      await knex.schema.table("universities", table => {
        let colDef;
        if (col.type === "string") colDef = table.string(col.name);
        else if (col.type === "integer") colDef = table.integer(col.name);
        else if (col.type === "float") colDef = table.float(col.name);
        else if (col.type === "decimal") colDef = table.decimal(col.name, col.precision, col.scale);
        else if (col.type === "boolean") colDef = table.boolean(col.name);
        else if (col.type === "text") colDef = table.text(col.name);
        else if (col.type === "jsonb") colDef = table.jsonb(col.name);
        if (col.default !== undefined) colDef.defaultTo(col.default);
      });
    }
  }
};

exports.down = function(knex) { return Promise.resolve(); };
