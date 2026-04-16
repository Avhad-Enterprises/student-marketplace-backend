import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import FinanceSettingsController from '@/controllers/financeSettings.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';

class FinanceSettingsRoute implements Route {
  public path = '/api/settings/finance';
  public router = Router();
  public financeSettingsController = new FinanceSettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware, roleMiddleware(['admin']));
    this.router.get(`/`, this.financeSettingsController.getSettings);
    this.router.post(`/`, this.financeSettingsController.updateSettings);
  }
}

export default FinanceSettingsRoute;
