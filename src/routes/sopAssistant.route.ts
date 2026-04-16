import { Router } from 'express';
import SopAssistantController from '@/controllers/sopAssistant.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateSOPDto, UpdateSOPDto, UpdateSopAssistantSettingsDto } from '@/dtos/sopAssistant.dto';

class SopAssistantRoute implements Route {
    public path = '/api/sop-assistant';
    public router = Router();
    public sopAssistantController = new SopAssistantController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Auth is required for all routes
        this.router.use(authMiddleware);

        // Admin-only global views and actions
        this.router.get(`/sops`, roleMiddleware(['admin']), this.sopAssistantController.getSOPs);
        this.router.get(`/stats`, roleMiddleware(['admin']), this.sopAssistantController.getStats);
        this.router.post(`/sops/import`, roleMiddleware(['admin']), this.sopAssistantController.importSOPs);
        
        // Student-specific actions (prepared for IDOR check in controller)
        this.router.get(`/sops/:id`, this.sopAssistantController.getSOPById);
        this.router.post(`/sops`, validationMiddleware(CreateSOPDto, 'body'), this.sopAssistantController.createSOP);
        this.router.put(`/sops/:id`, validationMiddleware(UpdateSOPDto, 'body'), this.sopAssistantController.updateSOP);
        this.router.patch(`/sops/:id/status`, this.sopAssistantController.updateStatus);

        // Settings routes (Admin only)
        this.router.get(`/settings`, roleMiddleware(['admin']), this.sopAssistantController.getSettings);
        this.router.post(`/settings`, roleMiddleware(['admin']), validationMiddleware(UpdateSopAssistantSettingsDto, 'body'), this.sopAssistantController.updateSettings);
    }
}

export default SopAssistantRoute;
