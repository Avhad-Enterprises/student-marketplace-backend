import { Router } from 'express';
import ServiceCountrySettingsController from '@/controllers/serviceCountrySettings.controller';
import Routes from '@/interfaces/routes.interface';

class ServiceCountrySettingsRoute implements Routes {
    public path = '/api/settings/service-country';
    public router = Router();
    public controller = new ServiceCountrySettingsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/`, this.controller.getSettings);
        this.router.post(`/`, this.controller.updateSettings);
    }
}

export default ServiceCountrySettingsRoute;
