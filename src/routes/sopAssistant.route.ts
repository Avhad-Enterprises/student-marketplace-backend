import { Router } from 'express';
import SopAssistantController from '@/controllers/sopAssistant.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class SopAssistantRoute implements Route {
    public path = '/api/sop-assistant';
    public router = Router();
    public sopAssistantController = new SopAssistantController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);
        this.router.get(`/sops`, this.sopAssistantController.getSOPs);
        this.router.get(`/stats`, this.sopAssistantController.getStats);
        this.router.post(`/sops`, this.sopAssistantController.createSOP);
        this.router.put(`/sops/:id`, this.sopAssistantController.updateSOP);
        this.router.patch(`/sops/:id/status`, this.sopAssistantController.updateStatus);

        // Settings routes
        this.router.get(`/settings`, this.sopAssistantController.getSettings);
        this.router.post(`/settings`, this.sopAssistantController.updateSettings);
    }
}

export default SopAssistantRoute;
