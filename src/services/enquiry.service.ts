import DB from "@/database";
import { Enquiry } from "@/interfaces/enquiry.interface";

export class EnquiryService {
    public async getAllEnquiries(): Promise<Enquiry[]> {
        const enquiries: Enquiry[] = await DB('enquiries').select('*').orderBy('date_submitted', 'desc');
        return enquiries;
    }

    public async getEnquiryById(id: string): Promise<Enquiry> {
        const enquiry: Enquiry = await DB('enquiries').where({ enquiry_id: id }).first();
        return enquiry;
    }

    public async createEnquiry(enquiryData: Enquiry): Promise<Enquiry> {
        await DB('enquiries').insert({
            ...enquiryData,
            created_at: new Date(),
            updated_at: new Date()
        });
        return this.getEnquiryById(enquiryData.enquiry_id);
    }

    public async updateEnquiry(id: string, enquiryData: Partial<Enquiry>): Promise<Enquiry> {
        await DB('enquiries').where({ enquiry_id: id }).update({
            ...enquiryData,
            updated_at: new Date()
        });
        return this.getEnquiryById(id);
    }

    public async deleteEnquiry(id: string): Promise<void> {
        await DB('enquiries').where({ enquiry_id: id }).delete();
    }

    public async convertEnquiryToLead(id: string, adminId: string): Promise<any> {
        return await DB.transaction(async (trx) => {
            const enquiry = await trx('enquiries').where({ enquiry_id: id }).first();
            if (!enquiry) throw new Error('Enquiry not found');

            // 1. Generate unique student_id
            const count = await trx('students').count('* as count').first();
            const nextId = parseInt(((count as any) || {}).count || '0') + 1001;
            const studentId = `STU-${nextId}`;

            // 2. Create Student Record
            const [student] = await trx('students').insert({
                student_id: studentId,
                email: enquiry.email,
                first_name: enquiry.student_name.split(' ')[0],
                last_name: enquiry.student_name.split(' ').slice(1).join(' ') || 'Candidate',
                current_stage: 'new',
                risk_level: enquiry.priority || 'medium',
                created_at: new Date()
            }).returning('*');

            // 3. Initialize Status History
            await trx('status_history').insert({
                student_db_id: student.id,
                stage: 'new',
                sub_status: 'New Lead',
                notes: `System: Converted from Enquiry ${enquiry.enquiry_id}`,
                changed_by: adminId,
                created_at: new Date()
            });

            // 4. Close Enquiry
            await trx('enquiries').where({ enquiry_id: id }).update({
                status: 'closed',
                updated_at: new Date()
            });

            return { studentId, db_id: student.id };
        });
    }

    public async importEnquiries(data: any[]): Promise<{ success: number; failed: number; errors: string[] }> {
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        await DB.transaction(async (trx) => {
            for (const item of data) {
                try {
                    const enquiryId = item.enquiry_id || item.enquiryId;
                    if (!enquiryId) throw new Error('Missing enquiry_id');

                    const payload: any = {
                        enquiry_id: enquiryId,
                        date_submitted: item.date_submitted ? new Date(item.date_submitted) : (item.dateSubmitted ? new Date(item.dateSubmitted) : new Date()),
                        student_name: item.student_name || item.studentName || 'Unknown Student',
                        email: item.email || '',
                        subject: item.subject || 'No Subject',
                        message: item.message || '',
                        priority: (item.priority || 'medium').toLowerCase(),
                        status: (item.status || 'new').toLowerCase(),
                        updated_at: new Date()
                    };

                    const existing = await trx('enquiries').where({ enquiry_id: enquiryId }).first();

                    if (existing) {
                        await trx('enquiries').where({ enquiry_id: enquiryId }).update(payload);
                    } else {
                        payload.created_at = new Date();
                        await trx('enquiries').insert(payload);
                    }
                    success++;
                } catch (error: any) {
                    failed++;
                    errors.push(`Row ${success + failed}: ${error.message}`);
                }
            }
        });

        return { success, failed, errors };
    }
}
