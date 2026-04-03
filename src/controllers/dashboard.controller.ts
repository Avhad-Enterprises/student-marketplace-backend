import { NextFunction, Request, Response } from 'express';
import DashboardService from '@/services/dashboard.service';

class DashboardController {
  public dashboardService = new DashboardService();

  public getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statsData = await this.dashboardService.getDashboardStats();
      res.status(200).json({ data: statsData, message: 'getDashboardStats' });
    } catch (error) {
      next(error);
    }
  };
}

export default DashboardController;
