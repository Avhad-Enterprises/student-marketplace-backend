export interface Housing {
    id: number;
    reference_id: string;
    provider_name: string;
    housing_type: string;
    location: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    avg_rent: string;
    verified: boolean;
    popularity: number;
    created_at?: Date;
    updated_at?: Date;
}
