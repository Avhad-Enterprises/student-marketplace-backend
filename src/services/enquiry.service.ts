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
}
