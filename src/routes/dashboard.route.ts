import { Router } from 'express';
import DashboardController from '@/controllers/dashboard.controller';
import Route from '@/interfaces/routes.interface';

class DashboardRoute implements Route {
  public path = '/dashboard';
  public router = Router();
  public dashboardController = new DashboardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/stats`, this.dashboardController.getDashboardStats);
  }
}

export default DashboardRoute;
