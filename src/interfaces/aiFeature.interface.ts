export interface AiFeature {
    id?: number;
    feature_id: string;
    order: number;
    name: string;
    status: 'active' | 'disabled';
    show_in_dashboard: boolean;
    linked_flow: string;
    description: string;
    starter_prompt: string;
    usage_30d: number;
    requires_ielts: boolean;
    requires_country: boolean;
    requires_profile: boolean;
    category: string;
    created_at?: Date;
    updated_at?: Date;
}
