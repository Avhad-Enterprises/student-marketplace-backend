import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import FinanceSettingsController from '@/controllers/complianceSettings.controller'; // Wait, let's ensure it maps to the correct one
import FinanceSettingsControllerCorrect from '@/controllers/financeSettings.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class FinanceSettingsRoute implements Route {
  public path = '/api/settings/finance';
  public router = Router();
  public financeSettingsController = new FinanceSettingsControllerCorrect();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/`, authMiddleware, this.financeSettingsController.getSettings);
    this.router.post(`/`, authMiddleware, this.financeSettingsController.updateSettings);
  }
}

export default FinanceSettingsRoute;
