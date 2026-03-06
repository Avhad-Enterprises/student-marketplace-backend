import { Router } from 'express';
import SystemSettingsController from '@/controllers/systemSettings.controller';
import Routes from '@/interfaces/routes.interface';

class SystemSettingsRoute implements Routes {
    public path = '/api/settings';
    public router = Router();
    public systemSettingsController = new SystemSettingsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/system`, this.systemSettingsController.getSystemSettings);
        this.router.post(`/system`, this.systemSettingsController.updateSystemSettings);
        this.router.get(`/notifications`, this.systemSettingsController.getNotificationSettings);
        this.router.put(`/notifications/:key`, this.systemSettingsController.updateNotificationSetting);
    }
}

export default SystemSettingsRoute;
