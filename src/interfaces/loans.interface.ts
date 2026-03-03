export interface Loan {
    id: number;
    loan_id: string;
    provider_name: string;
    product_name: string;
    amount_range: string;
    countries_supported: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    interest_type: 'Fixed' | 'Variable';
    collateral_required: boolean;
    approval_rate: string;
    popularity: number;
    created_at?: Date;
    updated_at?: Date;
}
