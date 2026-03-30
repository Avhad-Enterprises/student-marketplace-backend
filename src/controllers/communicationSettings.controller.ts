import { NextFunction, Request, Response } from 'express';
import CommunicationSettingsService from '@/services/communicationSettings.service';

export class CommunicationSettingsController {
  public service = new CommunicationSettingsService();

  public getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getSettings();
      res.status(200).json({ data, message: 'getSettings' });
    } catch (error) {
      next(error);
    }
  };

  public updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settingsData = req.body;
      const data = await this.service.updateSettings(settingsData);
      res.status(200).json({ data, message: 'updateSettings' });
    } catch (error) {
      next(error);
    }
  };

  public testConnection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.testConnection();
      res.status(200).json({ data, message: 'testConnection' });
    } catch (error) {
      next(error);
    }
  };
}
