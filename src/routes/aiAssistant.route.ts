import { Router } from 'express';
import { AiAssistantController } from '@/controllers/aiAssistant.controller'; // Changed to named import
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class AiAssistantRoute implements Route { // Changed to named export
    public path = '/api/ai-assistant';
    public router = Router();
    public aiAssistantController = new AiAssistantController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);
        this.router.get(`/settings`, this.aiAssistantController.getSettings);
        this.router.post(`/settings`, this.aiAssistantController.updateSettings);
    }
}
