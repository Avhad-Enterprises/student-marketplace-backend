export interface Tax {
    id: number;
    tax_id: string;
    service_name: string;
    provider: string;
    filing_type: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    residency_type: string;
    complexity: string;
    usage_rate: string;
    popularity: number;
    created_at?: string;
    updated_at?: string;
}
