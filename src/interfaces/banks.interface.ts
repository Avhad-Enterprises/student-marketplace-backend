export interface Bank {
    id: number;
    bank_id: string;
    bank_name: string;
    account_type: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    min_balance: string;
    digital_onboarding: boolean;
    student_friendly: boolean;
    popularity: number;
    created_at?: string;
    updated_at?: string;
}
