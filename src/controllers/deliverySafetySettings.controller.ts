import { NextFunction, Request, Response } from 'express';
import DeliverySafetySettingsService from '@/services/deliverySafetySettings.service';

export class DeliverySafetySettingsController {
  public service = new DeliverySafetySettingsService();

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
}
