/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('students', function(table) {
    // Education Snapshot
    table.string('highest_qualification');
    table.string('field_of_study');
    table.string('current_institution');
    table.string('graduation_year');
    table.string('gpa');

    // Lead & Attribution
    table.date('first_touch_date');
    table.text('conversion_path_summary');

    // Intent & Preferences
    table.string('preferred_course_level');
    table.string('budget_range');
    table.string('intake_preference');
    table.string('test_scores');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('students', function(table) {
    table.dropColumn('highest_qualification');
    table.dropColumn('field_of_study');
    table.dropColumn('current_institution');
    table.dropColumn('graduation_year');
    table.dropColumn('gpa');
    
    table.dropColumn('first_touch_date');
    table.dropColumn('conversion_path_summary');
    
    table.dropColumn('preferred_course_level');
    table.dropColumn('budget_range');
    table.dropColumn('intake_preference');
    table.dropColumn('test_scores');
  });
};
