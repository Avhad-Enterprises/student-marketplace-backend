import { Router } from 'express';
import { AiVisaSettingsController } from '@/controllers/aiVisaSettings.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class AiVisaSettingsRoute implements Route {
    public path = '/api/settings/ai-visa';
    public router = Router();
    public controller = new AiVisaSettingsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);
        this.router.get(`/`, this.controller.getSettings);
        this.router.post(`/`, this.controller.updateSettings);
    }
}
