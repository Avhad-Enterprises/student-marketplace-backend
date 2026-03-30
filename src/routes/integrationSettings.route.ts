import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import IntegrationSettingsController from '@/controllers/integrationSettings.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class IntegrationSettingsRoute implements Route {
  public path = '/api/settings/integrations';
  public router = Router();
  public integrationSettingsController = new IntegrationSettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/`, authMiddleware, this.integrationSettingsController.getSettings);
    this.router.post(`/`, authMiddleware, this.integrationSettingsController.updateSettings);
  }
}

export default IntegrationSettingsRoute;
