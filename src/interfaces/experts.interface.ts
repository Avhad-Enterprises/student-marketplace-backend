export interface Expert {
    id: number;
    expert_id: string;
    full_name: string;
    email?: string;
    phone?: string;
    specialization?: string;
    experience_years?: number;
    rating?: number;
    status: string;
    avatar_url?: string;
    bio?: string;
    created_at: Date;
    updated_at: Date;
}
