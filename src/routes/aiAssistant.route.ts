import { Router } from 'express';
import { AiAssistantController } from '@/controllers/aiAssistant.controller'; // Changed to named import
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { UpdateAiAssistantSettingsDto } from '@/dtos/aiAssistant.dto';

export class AiAssistantRoute implements Route { // Changed to named export
    public path = '/api/ai-assistant';
    public router = Router();
    public aiAssistantController = new AiAssistantController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // All AI assistant configuration routes require admin privileges
        this.router.use(authMiddleware, roleMiddleware(['admin']));
        
        this.router.get(`/settings`, this.aiAssistantController.getSettings);
        this.router.post(`/settings`, validationMiddleware(UpdateAiAssistantSettingsDto, 'body'), this.aiAssistantController.updateSettings);
        this.router.get(`/versions`, this.aiAssistantController.getVersions);
        this.router.post(`/rollback/:id`, this.aiAssistantController.rollbackToVersion);
    }
}
