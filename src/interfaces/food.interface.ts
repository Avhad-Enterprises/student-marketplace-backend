export interface Food {
    id: number;
    reference_id: string;
    platform: string;
    service_type: string;
    offer_details: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    avg_cost: string;
    verified: boolean;
    popularity: number;
    created_at?: Date;
    updated_at?: Date;
}
