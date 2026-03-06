export interface SystemSettings {
    id?: number;
    platform_name: string;
    support_email: string;
    primary_currency: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface NotificationSetting {
    id: number;
    key: string;
    title: string;
    description: string;
    enabled: boolean;
    type: 'email' | 'push';
    created_at: Date;
    updated_at: Date;
}
