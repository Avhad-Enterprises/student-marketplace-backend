export interface PolicyGlobalSettings {
    id?: number;
    enable_reacceptance: boolean;
    enable_consent_timestamp: boolean;
    log_retention_months: number;
    legal_contact_email: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface PolicyPage {
    id?: number;
    title: string;
    slug?: string;
    type: string;
    status: string;
    version: string;
    effective_date: string;
    visibility: string;
    content?: string;
    author_name?: string;
    last_updated_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}
