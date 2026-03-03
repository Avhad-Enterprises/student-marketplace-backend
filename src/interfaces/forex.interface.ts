export interface Forex {
    id: number;
    forex_id: string;
    provider_name: string;
    service_type: string;
    currency_pairs: number;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    avg_fee: string;
    transfer_speed: string;
    popularity: number;
    created_at?: Date;
    updated_at?: Date;
}
