import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import AdminNotificationSettingsController from '@/controllers/adminNotificationSettings.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';

class AdminNotificationSettingsRoute implements Route {
  public path = '/api/settings/admin-notifications';
  public router = Router();
  public adminNotificationSettingsController = new AdminNotificationSettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware, roleMiddleware(['admin']));

    this.router.get(`/`, this.adminNotificationSettingsController.getSettings);
    this.router.post(`/`, this.adminNotificationSettingsController.updateSettings);
  }
}

export default AdminNotificationSettingsRoute;
