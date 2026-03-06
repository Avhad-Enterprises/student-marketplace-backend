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
            const enquiryId = String(req.params.id);
            const findOneEnquiryData: Enquiry = await this.enquiryService.getEnquiryById(enquiryId);
            res.status(200).json({ data: findOneEnquiryData, message: 'findOne' });
        } catch (error) {
            next(error);
        }
    };

    public createEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const enquiryData: Enquiry = req.body;
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
}
