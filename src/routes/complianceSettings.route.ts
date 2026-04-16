import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import ComplianceSettingsController from '@/controllers/complianceSettings.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';

class ComplianceSettingsRoute implements Route {
  public path = '/api/settings/compliance';
  public router = Router();
  public complianceSettingsController = new ComplianceSettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware, roleMiddleware(['admin']));
    this.router.get(`/`, this.complianceSettingsController.getSettings);
    this.router.post(`/`, this.complianceSettingsController.updateSettings);
  }
}

export default ComplianceSettingsRoute;
