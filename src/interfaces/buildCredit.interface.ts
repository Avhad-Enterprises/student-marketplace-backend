export interface BuildCredit {
    id: number;
    reference_id: string;
    provider_name: string;
    program_name: string;
    card_type: string;
    countries_supported: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    credit_limit: string;
    monthly_fee: string;
    building_period: string;
    popularity: number;
    created_at?: Date;
    updated_at?: Date;
}
