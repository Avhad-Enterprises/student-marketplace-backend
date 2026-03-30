export interface AdminNotificationSettings {
    id?: number;
    alert_high_risk_student: boolean;
    alert_visa_rejection: boolean;
    alert_payment_failure: boolean;
    alert_expert_over_capacity: boolean;
    alert_recipient_roles: string[]; // Handled as string array in TS, serialized to JSON in DB
    enable_student_email_notifications: boolean;
    enable_booking_reminders: boolean;
    enable_deadline_reminders: boolean;
    enable_invoice_reminders: boolean;
    escalate_lead_hours: number;
    escalate_booking_hours: number;
    escalation_role: string;
    escalation_email: string;
    channel_email: boolean;
    channel_sms: boolean;
    channel_in_app: boolean;
    created_at?: string;
    updated_at?: string;
}
