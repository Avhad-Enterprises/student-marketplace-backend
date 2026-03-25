/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('students', function(table) {
    // 1. University Selection Consultation (Ensuring all from design are here)
    if (false) { // Just for documentation of logic
      // countries, intake, course_level, field_of_study, career_goal, long_term_plan, 
      // annual_budget, funding_source, family_constraints, timeline_urgency, consultation_notes
    }
    // Note: Some of these were added in previous turn, adding missing ones if any
    table.string('planning_countries');
    table.string('planning_intake');
    table.string('planning_course_level');
    table.string('planning_field_of_study');
    table.string('career_goal');
    table.string('long_term_plan');
    table.string('annual_budget');
    table.string('funding_source');
    table.string('family_constraints');
    table.string('timeline_urgency');
    table.text('consultation_notes');

    // 2. Profile Evaluation
    table.string('eval_grading_system');
    table.string('eval_institution_tier');
    table.string('eval_backlogs');
    table.string('eval_work_exp');
    table.string('eval_field_relevance');
    table.text('eval_internships');
    table.text('eval_research');
    table.string('eval_gap_years');
    table.text('eval_additional_notes');

    // 3. Eligibility & Readiness Check
    table.boolean('eligibility_prerequisites').defaultTo(false);
    table.boolean('eligibility_bridge_course').defaultTo(false);
    table.boolean('eligibility_english_test').defaultTo(false);
    table.boolean('eligibility_funds_ready').defaultTo(false);
    table.boolean('eligibility_sponsor_identified').defaultTo(false);
    table.boolean('eligibility_loan_required').defaultTo(false);
    table.boolean('eligibility_gap_explanation').defaultTo(false);
    table.string('visa_risk');
    table.text('visa_notes');

    // 4. Career Outcome Insights
    table.string('intended_job_role');
    table.string('preferred_industry');
    table.string('career_country_preference');
    table.string('job_market_awareness');
    table.string('salary_expectations');
    table.boolean('stay_back_interest').defaultTo(false);
    table.text('career_discussion_notes');

    // 5. University Shortlisting
    table.text('shortlisted_universities');
    table.text('shortlisted_course_details');
    table.string('shortlisted_country');
    table.string('shortlisted_priority');
    table.string('shortlisted_intake');
    table.string('shortlisted_budget_fit');
    table.string('shortlisted_eligibility_fit');
    table.string('shortlisted_visa_safety');

    // 6. Application Strategy
    table.string('app_strategy_order');
    table.string('app_strategy_type');
    table.string('app_strategy_deadline_awareness');
    table.string('app_strategy_deadline_risk');
    table.text('app_strategy_sop_approach');
    table.string('app_strategy_customization_level');
    table.string('app_strategy_lor_type');
    table.string('app_strategy_lor_count');
    table.text('app_strategy_notes');

    // 7. SOP Review & Editing
    table.string('sop_version');
    table.string('sop_draft_status');
    table.string('sop_assigned_editor');
    table.string('sop_structure_quality');
    table.string('sop_content_relevance');
    table.string('sop_language_clarity');
    table.text('sop_feedback_notes');
    table.string('sop_revision_count');

    // 8. LOR Coordination
    table.string('lor_count_required');
    table.string('lor_recommender_name');
    table.string('lor_recommender_relation');
    table.string('lor_recommender_email');
    table.string('lor_current_status');
    table.text('lor_coordination_notes');

    // 9. Application Submission Support
    table.boolean('submission_sop_uploaded').defaultTo(false);
    table.boolean('submission_lors_uploaded').defaultTo(false);
    table.boolean('submission_transcripts_uploaded').defaultTo(false);
    table.boolean('submission_fee_paid').defaultTo(false);
    table.string('submission_portal');
    table.boolean('submission_confirmation_received').defaultTo(false);
    table.text('submission_errors_faced');
    table.text('submission_resolution_notes');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('students', function(table) {
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
    columns.forEach(col => table.dropColumn(col));
  });
};
