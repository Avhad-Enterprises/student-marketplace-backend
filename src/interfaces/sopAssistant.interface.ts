export interface SOP {
    id?: number;
    student_id: string;
    student_name: string;
    country: string;
    university: string;
    review_status: string;
    ai_confidence_score: string;
    status: 'active' | 'inactive';
    created_at?: Date;
    updated_at?: Date;
}

export interface SOPStats {
    totalSOPs: number;
    draftsCreated: number;
    reviewedSOPs: number;
    avgConfidence: string;
}

export interface SOPAssistantSettings {
    id?: number;
    model_provider: string;
    model_version: string;
    system_prompt: string;
    confidence_threshold: number;
    auto_approval: boolean;
    max_tokens: number;
    temperature: number;
    updated_at?: Date;
}
