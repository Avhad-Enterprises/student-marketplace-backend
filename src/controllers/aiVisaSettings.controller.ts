import { NextFunction, Request, Response } from 'express';
import AiVisaSettingsService from '@/services/aiVisaSettings.service';

export class AiVisaSettingsController {
  public service = new AiVisaSettingsService();

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
