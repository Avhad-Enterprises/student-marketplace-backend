export interface Enquiry {
    id?: number;
    enquiry_id: string;
    date_submitted?: Date;
    student_name: string;
    email: string;
    subject: string;
    message?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'new' | 'in-progress' | 'responded' | 'closed';
    created_at?: Date;
    updated_at?: Date;
}
