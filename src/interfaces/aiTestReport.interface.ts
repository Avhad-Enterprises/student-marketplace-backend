export interface AITestReport {
    id?: number;
    report_id: string; // e.g., ISS-001
    type: string;
    severity: 'critical' | 'warning' | 'info';
    student_name: string;
    student_id: string;
    skill: string;
    exam_type: string;
    description: string;
    status: 'open' | 'investigating' | 'resolved';
    assigned_to?: string;
    created_at?: Date;
    updated_at?: Date;
}
