import DB from '@/database';
import { FinanceSettings } from '@/interfaces/financeSettings.interface';

class FinanceSettingsService {
    public async getSettings(): Promise<FinanceSettings> {
        const settings: any = await DB('finance_settings').first();
        if (!settings) {
            return {
                primary_currency: 'USD - US Dollar',
                secondary_currency: 'EUR - Euro',
                exchange_rate_provider: 'Open Exchange Rates',
                exchange_rate_frequency: 'Daily',
                auto_update_exchange_rates: true,
                enable_multi_currency: true,
                enable_credit_card: true,
                enable_debit_card: true,
                enable_bank_transfer: true,
                enable_paypal: false,
                enable_stripe: true,
                enable_apple_pay: false,
                enable_google_pay: false,
                default_payment_gateway: 'Stripe',
                invoice_prefix: 'INV',
                invoice_number_format: 'Sequential (INV-0001, INV-0002)',
                starting_invoice_number: 1000,
                invoice_due_period_days: 30,
                late_payment_fee_percent: 2.0,
                enable_auto_invoicing: true,
                enable_late_payment_fees: false,
                invoice_footer_text: 'Thank you for your business',
                enable_refunds: true,
                refund_approval_required: true,
                allow_partial_refunds: true,
                refund_window_days: 14,
                auto_refund_under_amount: 100.0,
                refund_processing_time_days: 5,
                require_approval_over_amount: 5000.0,
                fiscal_year_start_month: 'January',
                default_tax_rate: 0.0,
                enable_budget_tracking: true,
                enable_expense_reporting: true,
                enable_tax_calculation: true,
                enable_financial_reporting: true,
            };
        }
        return settings;
    }

    public async updateSettings(settingsData: Partial<FinanceSettings>): Promise<FinanceSettings> {
        const { id, created_at, updated_at, ...cleanData } = settingsData as any;
        
        const existing = await DB('finance_settings').first();
        const dataToSave = {
            ...cleanData,
            updated_at: new Date()
        };

        if (existing) {
            await DB('finance_settings').where({ id: existing.id }).update(dataToSave);
        } else {
            await DB('finance_settings').insert(dataToSave);
        }

        return this.getSettings();
    }
}

export default FinanceSettingsService;
