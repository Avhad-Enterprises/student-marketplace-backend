import DB from '@/database';

export const REPORTS_TABLE = 'reports';

export const initializeReportsTable = async () => {
    try {
        await DB.schema.createTableIfNotExists(REPORTS_TABLE, (table) => {
            table.increments('id').primary();
            table.integer('event_id').unsigned().nullable().references('id').inTable('universities').onDelete('CASCADE');
            table.string('name', 255).notNullable();
            table.text('description').nullable();
            table.string('category', 100).nullable(); 
            table.string('data_scope', 50).notNullable().defaultTo('this_event'); 
            table.string('visualization_type', 50).notNullable().defaultTo('table'); 
            table.jsonb('config_json').nullable();
            table.string('visibility', 50).notNullable().defaultTo('private'); 
            table.boolean('schedule_enabled').defaultTo(false);
            table.string('schedule_frequency', 50).nullable(); 
            table.text('schedule_recipients').nullable(); 
            table.integer('created_by').unsigned().nullable().references('users.id').onDelete('SET NULL');
            table.timestamp('created_at').defaultTo(DB.fn.now());
            table.timestamp('updated_at').defaultTo(DB.fn.now());
            table.boolean('is_deleted').defaultTo(false);

            table.index('event_id');
            table.index('category');
            table.index('visibility');
            table.index('created_by');
        });

        // Trigger for update_timestamp is usually handled globally or via Knex
    } catch (error) {
        console.error('Failed to initialize reports table:', error);
    }
};
