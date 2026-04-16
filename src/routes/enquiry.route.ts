import { Router } from 'express';
import { EnquiryController } from '@/controllers/enquiry.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateEnquiryDto, UpdateEnquiryDto } from '@/dtos/enquiry.dto';

export class EnquiryRoute implements Route {
    public path = '/api/enquiries';
    public router = Router();
    public enquiryController = new EnquiryController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all enquiry routes
        this.router.use(authMiddleware);

        // View single enquiry
        this.router.get(`/:id`, this.enquiryController.getEnquiryById);

        // Administrative Actions (Admin only + Validation)
        this.router.get(`/`, roleMiddleware(['admin']), this.enquiryController.getAllEnquiries);
        this.router.post(`/`, roleMiddleware(['admin']), validationMiddleware(CreateEnquiryDto, 'body'), this.enquiryController.createEnquiry);
        this.router.post(`/import`, roleMiddleware(['admin']), this.enquiryController.importEnquiries);
        this.router.put(`/:id`, roleMiddleware(['admin']), validationMiddleware(UpdateEnquiryDto, 'body'), this.enquiryController.updateEnquiry);
        this.router.delete(`/:id`, roleMiddleware(['admin']), this.enquiryController.deleteEnquiry);
        this.router.post(`/:id/convert`, roleMiddleware(['admin']), this.enquiryController.convertEnquiryToLead);
    }
}
