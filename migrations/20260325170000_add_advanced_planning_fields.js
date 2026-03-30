/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const table = 'students';
  const columns = [
    { name: 'planning_countries', type: 'string' },
    { name: 'planning_intake', type: 'string' },
    { name: 'planning_course_level', type: 'string' },
    { name: 'planning_field_of_study', type: 'string' },
    { name: 'career_goal', type: 'string' },
    { name: 'long_term_plan', type: 'string' },
    { name: 'annual_budget', type: 'string' },
    { name: 'funding_source', type: 'string' },
    { name: 'family_constraints', type: 'string' },
    { name: 'timeline_urgency', type: 'string' },
    { name: 'consultation_notes', type: 'text' },
    { name: 'eval_grading_system', type: 'string' },
    { name: 'eval_institution_tier', type: 'string' },
    { name: 'eval_backlogs', type: 'string' },
    { name: 'eval_work_exp', type: 'string' },
    { name: 'eval_field_relevance', type: 'string' },
    { name: 'eval_internships', type: 'text' },
    { name: 'eval_research', type: 'text' },
    { name: 'eval_gap_years', type: 'string' },
    { name: 'eval_additional_notes', type: 'text' },
    { name: 'eligibility_prerequisites', type: 'boolean', default: false },
    { name: 'eligibility_bridge_course', type: 'boolean', default: false },
    { name: 'eligibility_english_test', type: 'boolean', default: false },
    { name: 'eligibility_funds_ready', type: 'boolean', default: false },
    { name: 'eligibility_sponsor_identified', type: 'boolean', default: false },
    { name: 'eligibility_loan_required', type: 'boolean', default: false },
    { name: 'eligibility_gap_explanation', type: 'boolean', default: false },
    { name: 'visa_risk', type: 'string' },
    { name: 'visa_notes', type: 'text' },
    { name: 'intended_job_role', type: 'string' },
    { name: 'preferred_industry', type: 'string' },
    { name: 'career_country_preference', type: 'string' },
    { name: 'job_market_awareness', type: 'string' },
    { name: 'salary_expectations', type: 'string' },
    { name: 'stay_back_interest', type: 'boolean', default: false },
    { name: 'career_discussion_notes', type: 'text' },
    { name: 'shortlisted_universities', type: 'text' },
    { name: 'shortlisted_course_details', type: 'text' },
    { name: 'shortlisted_country', type: 'string' },
    { name: 'shortlisted_priority', type: 'string' },
    { name: 'shortlisted_intake', type: 'string' },
    { name: 'shortlisted_budget_fit', type: 'string' },
    { name: 'shortlisted_eligibility_fit', type: 'string' },
    { name: 'shortlisted_visa_safety', type: 'string' },
    { name: 'app_strategy_order', type: 'string' },
    { name: 'app_strategy_type', type: 'string' },
    { name: 'app_strategy_deadline_awareness', type: 'string' },
    { name: 'app_strategy_deadline_risk', type: 'string' },
    { name: 'app_strategy_sop_approach', type: 'text' },
    { name: 'app_strategy_customization_level', type: 'string' },
    { name: 'app_strategy_lor_type', type: 'string' },
    { name: 'app_strategy_lor_count', type: 'string' },
    { name: 'app_strategy_notes', type: 'text' },
    { name: 'sop_version', type: 'string' },
    { name: 'sop_draft_status', type: 'string' },
    { name: 'sop_assigned_editor', type: 'string' },
    { name: 'sop_structure_quality', type: 'string' },
    { name: 'sop_content_relevance', type: 'string' },
    { name: 'sop_language_clarity', type: 'string' },
    { name: 'sop_feedback_notes', type: 'text' },
    { name: 'sop_revision_count', type: 'string' },
    { name: 'lor_count_required', type: 'string' },
    { name: 'lor_recommender_name', type: 'string' },
    { name: 'lor_recommender_relation', type: 'string' },
    { name: 'lor_recommender_email', type: 'string' },
    { name: 'lor_current_status', type: 'string' },
    { name: 'lor_coordination_notes', type: 'text' },
    { name: 'submission_sop_uploaded', type: 'boolean', default: false },
    { name: 'submission_lors_uploaded', type: 'boolean', default: false },
    { name: 'submission_transcripts_uploaded', type: 'boolean', default: false },
    { name: 'submission_fee_paid', type: 'boolean', default: false },
    { name: 'submission_portal', type: 'string' },
    { name: 'submission_confirmation_received', type: 'boolean', default: false },
    { name: 'submission_errors_faced', type: 'text' },
    { name: 'submission_resolution_notes', type: 'text' }
  ];

  for (const col of columns) {
    const hasCol = await knex.schema.hasColumn(table, col.name);
    if (!hasCol) {
        await knex.schema.table(table, t => {
          let column;
          if (col.type === 'string') column = t.string(col.name);
          else if (col.type === 'text') column = t.text(col.name);
          else if (col.type === 'boolean') column = t.boolean(col.name);
          
          if (col.default !== undefined) column.defaultTo(col.default);
        });
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const table = 'students';
  const columns = [
    'planning_countries', 'planning_intake', 'planning_course_level', 'planning_field_of_study', 
    'career_goal', 'long_term_plan', 'annual_budget', 'funding_source', 'family_constraints', 
    'timeline_urgency', 'consultation_notes', 'eval_grading_system', 'eval_institution_tier', 
    'eval_backlogs', 'eval_work_exp', 'eval_field_relevance', 'eval_internships', 'eval_research', 
    'eval_gap_years', 'eval_additional_notes', 'eligibility_prerequisites', 'eligibility_bridge_course', 
    'eligibility_english_test', 'eligibility_funds_ready', 'eligibility_sponsor_identified', 
    'eligibility_loan_required', 'eligibility_gap_explanation', 'visa_risk', 'visa_notes', 
    'intended_job_role', 'preferred_industry', 'career_country_preference', 'job_market_awareness', 
    'salary_expectations', 'stay_back_interest', 'career_discussion_notes', 'shortlisted_universities', 
    'shortlisted_course_details', 'shortlisted_country', 'shortlisted_priority', 'shortlisted_intake', 
    'shortlisted_budget_fit', 'shortlisted_eligibility_fit', 'shortlisted_visa_safety', 'app_strategy_order', 
    'app_strategy_type', 'app_strategy_deadline_awareness', 'app_strategy_deadline_risk', 
    'app_strategy_sop_approach', 'app_strategy_customization_level', 'app_strategy_lor_type', 
    'app_strategy_lor_count', 'app_strategy_notes', 'sop_version', 'sop_draft_status', 
    'sop_assigned_editor', 'sop_structure_quality', 'sop_content_relevance', 'sop_language_clarity', 
    'sop_feedback_notes', 'sop_revision_count', 'lor_count_required', 'lor_recommender_name', 
    'lor_recommender_relation', 'lor_recommender_email', 'lor_current_status', 'lor_coordination_notes', 
    'submission_sop_uploaded', 'submission_lors_uploaded', 'submission_transcripts_uploaded', 
    'submission_fee_paid', 'submission_portal', 'submission_confirmation_received', 
    'submission_errors_faced', 'submission_resolution_notes'
  ];

  for (const col of columns) {
    const hasCol = await knex.schema.hasColumn(table, col);
    if (hasCol) {
        await knex.schema.table(table, t => t.dropColumn(col));
    }
  }
};
