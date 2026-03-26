/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const tableExists = await knex.schema.hasTable('countries');
  if (!tableExists) return;

  const colsToAdd = [
    // 1. BASIC INFORMATION
    { name: 'capital_city', type: 'string' },
    { name: 'official_languages', type: 'string' },
    { name: 'climate', type: 'text' },
    { name: 'safety_rating', type: 'float' },

    // 2. COSTS
    { name: 'living_cost_min', type: 'float' },
    { name: 'living_cost_max', type: 'float' },
    { name: 'total_cost_min', type: 'float' },
    { name: 'total_cost_max', type: 'float' },
    { name: 'health_insurance_min', type: 'float' },
    { name: 'health_insurance_max', type: 'float' },
    { name: 'tuition_fees_min', type: 'float' },
    { name: 'tuition_fees_max', type: 'float' },

    // 3. ACADEMIC SYSTEM
    { name: 'academic_system', type: 'string' },
    { name: 'bachelor_duration', type: 'float' },
    { name: 'master_duration', type: 'float' },
    { name: 'intake_seasons', type: 'string' },
    { name: 'ielts_min', type: 'float' },
    { name: 'ielts_max', type: 'float' },
    { name: 'toefl_min', type: 'integer' },
    { name: 'toefl_max', type: 'integer' },

    // 4. VISA & WORK RIGHTS
    { name: 'student_visa_type', type: 'string' },
    { name: 'visa_processing_min', type: 'integer' },
    { name: 'visa_processing_max', type: 'integer' },
    { name: 'work_hours_per_week', type: 'integer' },
    { name: 'psw_duration_months', type: 'integer' },
    { name: 'visa_fee', type: 'float' },

    // 5. OPPORTUNITIES
    { name: 'top_universities', type: 'jsonb' },
    { name: 'popular_cities', type: 'jsonb' },
    { name: 'job_market_strengths', type: 'jsonb' },
    { name: 'pr_pathway', type: 'text' },

    // 6. DECISION / AI FIELDS
    { name: 'roi_score', type: 'string' },
    { name: 'visa_success_rate', type: 'float' },
    { name: 'pr_probability', type: 'string' },
    { name: 'acceptance_rate', type: 'float' },
    { name: 'tags', type: 'jsonb' },
    { name: 'ai_context_summary', type: 'text' },
    { name: 'key_attractions', type: 'text' },

    // 7. MARKETPLACE
    { name: 'visa_providers', type: 'jsonb' },
    { name: 'loan_providers', type: 'jsonb' },
    { name: 'housing_providers', type: 'jsonb' },
    { name: 'insurance_providers', type: 'jsonb' },
    { name: 'forex_providers', type: 'jsonb' },

    // 8. MEDIA & SEO
    { name: 'hero_image', type: 'string' },
    { name: 'flag_icon', type: 'string' },
    { name: 'meta_title', type: 'string' },
    { name: 'meta_description', type: 'text' },
    { name: 'meta_keywords', type: 'string' },
    { name: 'slug', type: 'string' }
  ];

  for (const col of colsToAdd) {
    const hasCol = await knex.schema.hasColumn('countries', col.name);
    if (!hasCol) {
      await knex.schema.table('countries', (table) => {
        if (col.type === 'string') table.string(col.name);
        else if (col.type === 'text') table.text(col.name);
        else if (col.type === 'float') table.float(col.name);
        else if (col.type === 'integer') table.integer(col.name);
        else if (col.type === 'jsonb') table.jsonb(col.name);
      });
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Usually down is just cleanup if needed, but safe drop is better
  const cols = [
    'capital_city', 'official_languages', 'climate', 'safety_rating',
    'living_cost_min', 'living_cost_max', 'total_cost_min', 'total_cost_max',
    'health_insurance_min', 'health_insurance_max', 'tuition_fees_min', 'tuition_fees_max',
    'academic_system', 'bachelor_duration', 'master_duration', 'intake_seasons',
    'ielts_min', 'ielts_max', 'toefl_min', 'toefl_max',
    'student_visa_type', 'visa_processing_min', 'visa_processing_max',
    'work_hours_per_week', 'psw_duration_months', 'visa_fee',
    'top_universities', 'popular_cities', 'job_market_strengths', 'pr_pathway',
    'roi_score', 'visa_success_rate', 'pr_probability', 'acceptance_rate', 'tags',
    'ai_context_summary', 'key_attractions',
    'visa_providers', 'loan_providers', 'housing_providers', 'insurance_providers', 'forex_providers',
    'hero_image', 'flag_icon', 'meta_title', 'meta_description', 'meta_keywords', 'slug'
  ];

  for (const colName of cols) {
    const hasCol = await knex.schema.hasColumn('countries', colName);
    if (hasCol) {
      await knex.schema.table('countries', table => table.dropColumn(colName));
    }
  }
};
