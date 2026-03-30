export interface CommunicationSettings {
    id?: number;
    email_provider: string;
    api_key: string;
    webhook_url: string;
    ip_pool_name: string;
    connection_status: string;
    last_synced: Date;
    email_settings: {
        daily_limit: number;
        retry_logic: boolean;
        tracking_enabled: boolean;
    };
    campaign_defaults: {
        default_from_name: string;
        default_from_email: string;
        unsubscribe_link: boolean;
    };
    // Email Configuration
    default_from_name: string;
    default_from_email: string;
    reply_to_email: string;
    email_footer_text: string;
    email_signature: string;
    enable_notifications: boolean;
    enable_auto_status_emails: boolean;
    enable_campaign_tracking: boolean;
    domain_verification_status: string;
    
    // Campaign Defaults
    default_campaign_owner: string;
    default_lead_source_tag: string;
    default_attribution_model: string;
    campaign_auto_expiry_days: number;
    enable_conversion_tracking: boolean;

    // Sender Identity
    verified_domains: string;
    dkim_status: string;
    spf_status: string;
    sender_name_list: string;
    default_sender_name: string;

    created_at?: Date;
    updated_at?: Date;
}
