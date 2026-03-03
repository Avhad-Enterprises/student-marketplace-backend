export interface SimCard {
    id?: number;
    sim_id: string;
    provider_name: string;
    service_name: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    network_type: string;
    data_allowance: string;
    validity: string;
    popularity: number;
    created_at?: Date;
    updated_at?: Date;
}
