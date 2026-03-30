import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import LocalizationSettingsController from '@/controllers/localizationSettings.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class LocalizationSettingsRoute implements Route {
  public path = '/api/settings/localization';
  public router = Router();
  public localizationSettingsController = new LocalizationSettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/`, authMiddleware, this.localizationSettingsController.getSettings);
    this.router.post(`/`, authMiddleware, this.localizationSettingsController.updateSettings);
  }
}

export default LocalizationSettingsRoute;
