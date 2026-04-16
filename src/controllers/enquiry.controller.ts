import { NextFunction, Request, Response } from 'express';
import { EnquiryService } from '@/services/enquiry.service';
import { Enquiry } from '@/interfaces/enquiry.interface';

export class EnquiryController {
    public enquiryService = new EnquiryService();

    public getAllEnquiries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const findAllEnquiriesData: Enquiry[] = await this.enquiryService.getAllEnquiries();
            res.status(200).json({ data: findAllEnquiriesData, message: 'findAll' });
        } catch (error) {
            next(error);
        }
    };

    public getEnquiryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = (req as any).user;
            const isAdmin = user?.user_type === 'admin' || user?.role === 'admin';
            const enquiryId = String(req.params.id);
            const findOneEnquiryData: any = await this.enquiryService.getEnquiryById(enquiryId);
            
            if (!findOneEnquiryData) {
                res.status(404).json({ error: "Enquiry not found" });
                return;
            }

            // Ownership Validation: Admin bypass OR student_code match OR legacy record (null student_id)
            const isOwner = user?.student_code && findOneEnquiryData.student_id && 
                            user.student_code.toLowerCase() === findOneEnquiryData.student_id.toLowerCase();

            // Students are blocked ONLY if the record has an owner and it's not them
            if (!isAdmin && !isOwner && findOneEnquiryData.student_id !== null && findOneEnquiryData.student_id !== undefined) {
                res.status(403).json({ error: "Forbidden: You do not have permission to access this enquiry" });
                return;
            }

            res.status(200).json({ data: findOneEnquiryData, message: 'findOne' });
        } catch (error) {
            next(error);
        }
    };

    public createEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = (req as any).user;
            const enquiryData: any = { ...req.body, student_id: user?.student_code };
            const createEnquiryData: Enquiry = await this.enquiryService.createEnquiry(enquiryData);
            res.status(201).json({ data: createEnquiryData, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    public updateEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const enquiryId = String(req.params.id);
            const enquiryData: Partial<Enquiry> = req.body;
            const updateEnquiryData: Enquiry = await this.enquiryService.updateEnquiry(enquiryId, enquiryData);
            res.status(200).json({ data: updateEnquiryData, message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    public deleteEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const enquiryId = String(req.params.id);
            await this.enquiryService.deleteEnquiry(enquiryId);
            res.status(200).json({ message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };

    public convertEnquiryToLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = (req as any).user;
            const enquiryId = String(req.params.id);
            const conversionResult = await this.enquiryService.convertEnquiryToLead(enquiryId, user?.id || 'system-admin');
            res.status(200).json({ data: conversionResult, message: 'converted' });
        } catch (error) {
            next(error);
        }
    };

    public importEnquiries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = req.body;
            if (!Array.isArray(data)) {
                res.status(400).json({ message: 'Input data must be an array' });
                return;
            }
            const result = await this.enquiryService.importEnquiries(data);
            res.status(200).json({ data: result, message: 'importEnquiries' });
        } catch (error) {
            next(error);
        }
    };
}
