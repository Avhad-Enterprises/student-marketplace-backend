import { Router } from 'express';
import ServiceCountrySettingsController from '@/controllers/serviceCountrySettings.controller';
import Routes from '@/interfaces/routes.interface';

import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';

class ServiceCountrySettingsRoute implements Routes {
    public path = '/api/settings/service-country';
    public router = Router();
    public controller = new ServiceCountrySettingsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware, roleMiddleware(['admin']));
        this.router.get(`/`, this.controller.getSettings);
        this.router.post(`/`, this.controller.updateSettings);
    }
}

export default ServiceCountrySettingsRoute;
