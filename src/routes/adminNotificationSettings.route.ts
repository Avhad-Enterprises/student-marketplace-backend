import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import AdminNotificationSettingsController from '@/controllers/adminNotificationSettings.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class AdminNotificationSettingsRoute implements Route {
  public path = '/api/settings/admin-notifications';
  public router = Router();
  public adminNotificationSettingsController = new AdminNotificationSettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/`, authMiddleware, this.adminNotificationSettingsController.getSettings);
    this.router.post(`/`, authMiddleware, this.adminNotificationSettingsController.updateSettings);
  }
}

export default AdminNotificationSettingsRoute;
