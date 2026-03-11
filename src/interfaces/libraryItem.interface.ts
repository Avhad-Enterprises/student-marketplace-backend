export interface LibraryItem {
    id?: number;
    item_id: string; // The R001, L001 string used in frontend
    title: string;
    exam: string;
    difficulty?: string;
    topic?: string;
    type?: string;
    transcript?: boolean;
    sections_included?: string[]; // Use snake_case for DB fields
    duration?: string;
    status: 'Published' | 'Draft' | 'In Review' | 'Archived';
    usage_30d: number;
    created_at?: Date;
    updated_at?: Date;
}
