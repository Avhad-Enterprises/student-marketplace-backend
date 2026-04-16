import { Router } from 'express';
import { DeliverySafetySettingsController } from '@/controllers/deliverySafetySettings.controller';
import Route from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';

export class DeliverySafetySettingsRoute implements Route {
    public path = '/api/settings/delivery-safety';
    public router = Router();
    public controller = new DeliverySafetySettingsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware, roleMiddleware(['admin']));
        this.router.get(`/`, this.controller.getSettings);
        this.router.post(`/`, this.controller.updateSettings);
    }
}
