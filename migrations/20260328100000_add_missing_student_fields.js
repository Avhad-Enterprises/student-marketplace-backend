/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('students', function(table) {
    table.string('student_intent');
    table.jsonb('interested_services');
    table.string('communication_preference');
    table.string('timezone');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('students', function(table) {
    table.dropColumn('student_intent');
    table.dropColumn('interested_services');
    table.dropColumn('communication_preference');
    table.dropColumn('timezone');
  });
};
