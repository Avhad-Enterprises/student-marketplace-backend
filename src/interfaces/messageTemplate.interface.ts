export interface MessageTemplate {
    id?: number;
    template_id: string;
    name: string;
    type: string; // 'Email' | 'SMS' | 'WhatsApp'
    linked_event: string;
    status: string; // 'Active' | 'Inactive'
    content?: string;
    subject?: string;
    created_at?: Date;
    updated_at?: Date;
}
