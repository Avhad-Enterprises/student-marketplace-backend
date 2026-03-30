/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const table = 'admin_notification_settings';
    
    // Create table if it doesn't exist
    const exists = await knex.schema.hasTable(table);
    if (!exists) {
        await knex.schema.createTable(table, t => {
            t.increments('id').primary();
            t.boolean('alert_high_risk_student').defaultTo(true);
            t.boolean('alert_visa_rejection').defaultTo(true);
            t.boolean('alert_payment_failure').defaultTo(true);
            t.boolean('alert_expert_over_capacity').defaultTo(true);
            t.text('alert_recipient_roles').defaultTo('["Admin", "Manager"]');
            
            t.boolean('enable_student_email_notifications').defaultTo(true);
            t.boolean('enable_booking_reminders').defaultTo(true);
            t.boolean('enable_deadline_reminders').defaultTo(true);
            t.boolean('enable_invoice_reminders').defaultTo(true);
            
            t.integer('escalate_lead_hours').defaultTo(24);
            t.integer('escalate_booking_hours').defaultTo(48);
            t.string('escalation_role', 100).defaultTo('Senior Manager');
            t.string('escalation_email', 255).defaultTo('escalation@company.com');
            
            t.boolean('channel_email').defaultTo(true);
            t.boolean('channel_sms').defaultTo(false);
            t.boolean('channel_in_app').defaultTo(true);
            
            t.timestamps(true, true);
        });
    } else {
        // Table exists, add columns if missing
        const columns = [
            { name: 'alert_high_risk_student', type: 'boolean', default: true },
            { name: 'alert_visa_rejection', type: 'boolean', default: true },
            { name: 'alert_payment_failure', type: 'boolean', default: true },
            { name: 'alert_expert_over_capacity', type: 'boolean', default: true },
            { name: 'alert_recipient_roles', type: 'text', default: '["Admin", "Manager"]' },
            { name: 'enable_student_email_notifications', type: 'boolean', default: true },
            { name: 'enable_booking_reminders', type: 'boolean', default: true },
            { name: 'enable_deadline_reminders', type: 'boolean', default: true },
            { name: 'enable_invoice_reminders', type: 'boolean', default: true },
            { name: 'escalate_lead_hours', type: 'integer', default: 24 },
            { name: 'escalate_booking_hours', type: 'integer', default: 48 },
            { name: 'escalation_role', type: 'string', default: 'Senior Manager' },
            { name: 'escalation_email', type: 'string', default: 'escalation@company.com' },
            { name: 'channel_email', type: 'boolean', default: true },
            { name: 'channel_sms', type: 'boolean', default: false },
            { name: 'channel_in_app', type: 'boolean', default: true }
        ];

        for (const col of columns) {
            const hasColumn = await knex.schema.hasColumn(table, col.name);
            if (!hasColumn) {
                await knex.schema.table(table, t => {
                    let c;
                    if (col.type === 'boolean') c = t.boolean(col.name).defaultTo(col.default);
                    else if (col.type === 'integer') c = t.integer(col.name).defaultTo(col.default);
                    else if (col.type === 'text') c = t.text(col.name).defaultTo(col.default);
                    else if (col.type === 'string') c = t.string(col.name).defaultTo(col.default);
                    c.nullable();
                });
            }
        }
    }

    // Ensure initial record exists
    const hasRecord = await knex(table).where('id', 1).first();
    if (!hasRecord) {
        await knex(table).insert({ id: 1 });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('admin_notification_settings');
};
