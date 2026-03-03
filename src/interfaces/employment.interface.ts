export interface Employment {
    id: number;
    reference_id: string;
    platform: string;
    service_type: string;
    job_types: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    avg_salary: string;
    verified: boolean;
    popularity: number;
    created_at?: Date;
    updated_at?: Date;
}
