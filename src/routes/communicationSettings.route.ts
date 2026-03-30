import { Router } from 'express';
import { CommunicationSettingsController } from '@/controllers/communicationSettings.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class CommunicationSettingsRoute implements Route {
    public path = '/api/settings/communications';
    public router = Router();
    public controller = new CommunicationSettingsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);
        this.router.get(`/`, this.controller.getSettings);
        this.router.post(`/`, this.controller.updateSettings);
        this.router.post(`/test-connection`, this.controller.testConnection);
    }
}
