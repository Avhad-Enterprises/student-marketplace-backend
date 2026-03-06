import { Router } from 'express';
import { EnquiryController } from '@/controllers/enquiry.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class EnquiryRoute implements Route {
    public path = '/api/enquiries';
    public router = Router();
    public enquiryController = new EnquiryController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/`, authMiddleware, this.enquiryController.getAllEnquiries);
        this.router.get(`/:id`, authMiddleware, this.enquiryController.getEnquiryById);
        this.router.post(`/`, authMiddleware, this.enquiryController.createEnquiry);
        this.router.put(`/:id`, authMiddleware, this.enquiryController.updateEnquiry);
        this.router.delete(`/:id`, authMiddleware, this.enquiryController.deleteEnquiry);
    }
}
