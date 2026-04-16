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
        const { startDate, endDate } = req.query as { startDate: string, endDate: string };
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        
        const data = await this.dashboardService.getSummary(start, end);
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
      const { startDate, endDate } = req.query as { startDate: string, endDate: string };
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      const data = await this.dashboardService.getAdminUsers(start, end);
      res.status(200).json({ data, message: 'ok' });
    } catch (error) {
      next(error);
    }
  };
}

export default DashboardController;
