export interface Insurance {
    id: number;
    insurance_id: string;
    provider_name: string;
    policy_name: string;
    coverage_type: string;
    countries_covered: number;
    status: string;
    student_visible: boolean;
    duration: string;
    visa_compliant: boolean;
    mandatory: boolean;
    popularity: number;
    created_at: string;
    updated_at: string;
}
