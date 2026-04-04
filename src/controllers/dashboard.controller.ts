import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import DashboardService from '@/services/dashboard.service';

class DashboardController {
  public dashboardService = new DashboardService();

  public getDashboardStats = async (req: any, res: Response, next: NextFunction) => {
    try {
      const statsData = await this.dashboardService.getDashboardStats();
      res.status(200).json({ data: statsData, message: 'getDashboardStats' });
    } catch (error) {
      next(error);
    }
  };

  public getSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await this.dashboardService.getSummary();
        res.status(200).json({ data, message: 'ok' });
    } catch (error) {
      next(error);
    }
  };

  public getAlerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.dashboardService.getAlerts();
      res.status(200).json({ data, message: 'ok' });
    } catch (error) {
      next(error);
    }
  };

  public getInsights = async (req: any, res: Response, next: NextFunction) => {
    try {
      const data = await this.dashboardService.getInsights();
      res.status(200).json({ data, message: 'ok' });
    } catch (error) {
      next(error);
    }
  };

  public getAdminUsers = async (req: any, res: Response, next: NextFunction) => {
    try {
      const data = await this.dashboardService.getAdminUsers();
      res.status(200).json({ data, message: 'ok' });
    } catch (error) {
      next(error);
    }
  };
}

export default DashboardController;
