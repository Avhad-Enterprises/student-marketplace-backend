export interface Course {
    id: number;
    reference_id: string;
    course_name: string;
    provider: string;
    category: string;
    duration: string;
    avg_cost: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    popularity: number;
    learners_count?: number;
    rating?: number;
    created_at?: Date;
    updated_at?: Date;
}
