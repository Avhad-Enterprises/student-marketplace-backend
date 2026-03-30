/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const table = 'finance_settings';
    
    // Create table if it doesn't exist
    const exists = await knex.schema.hasTable(table);
    if (!exists) {
        await knex.schema.createTable(table, t => {
            t.increments('id').primary();
            
            // Currency & Financial Defaults
            t.string('primary_currency', 100).defaultTo('USD - US Dollar');
            t.string('secondary_currency', 100).defaultTo('EUR - Euro');
            t.string('exchange_rate_provider', 100).defaultTo('Open Exchange Rates');
            t.string('exchange_rate_frequency', 50).defaultTo('Daily');
            t.boolean('auto_update_exchange_rates').defaultTo(true);
            t.boolean('enable_multi_currency').defaultTo(true);
            
            // Payment Methods
            t.boolean('enable_credit_card').defaultTo(true);
            t.boolean('enable_debit_card').defaultTo(true);
            t.boolean('enable_bank_transfer').defaultTo(true);
            t.boolean('enable_paypal').defaultTo(false);
            t.boolean('enable_stripe').defaultTo(true);
            t.boolean('enable_apple_pay').defaultTo(false);
            t.boolean('enable_google_pay').defaultTo(false);
            t.string('default_payment_gateway', 100).defaultTo('Stripe');
            
            // Invoice & Billing Rules
            t.string('invoice_prefix', 50).defaultTo('INV');
            t.string('invoice_number_format', 100).defaultTo('Sequential (INV-0001, INV-0002)');
            t.integer('starting_invoice_number').defaultTo(1000);
            t.integer('invoice_due_period_days').defaultTo(30);
            t.float('late_payment_fee_percent').defaultTo(2.0);
            t.boolean('enable_auto_invoicing').defaultTo(true);
            t.boolean('enable_late_payment_fees').defaultTo(false);
            t.text('invoice_footer_text').defaultTo('Thank you for your business');
            
            // Refund Rules
            t.boolean('enable_refunds').defaultTo(true);
            t.boolean('refund_approval_required').defaultTo(true);
            t.boolean('allow_partial_refunds').defaultTo(true);
            t.integer('refund_window_days').defaultTo(14);
            t.float('auto_refund_under_amount').defaultTo(100.0);
            t.integer('refund_processing_time_days').defaultTo(5);
            
            // Financial Controls
            t.float('require_approval_over_amount').defaultTo(5000.0);
            t.string('fiscal_year_start_month', 50).defaultTo('January');
            t.float('default_tax_rate').defaultTo(0.0);
            t.boolean('enable_budget_tracking').defaultTo(true);
            t.boolean('enable_expense_reporting').defaultTo(true);
            t.boolean('enable_tax_calculation').defaultTo(true);
            t.boolean('enable_financial_reporting').defaultTo(true);
            
            t.timestamps(true, true);
        });
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
    await knex.schema.dropTableIfExists('finance_settings');
};
