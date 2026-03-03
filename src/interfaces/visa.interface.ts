export interface Visa {
    id: number;
    visa_id: string;
    visa_type: string;
    category: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    processing_difficulty: string;
    work_rights: boolean;
    high_approval: boolean;
    popularity: number;
    created_at?: Date;
    updated_at?: Date;
}
