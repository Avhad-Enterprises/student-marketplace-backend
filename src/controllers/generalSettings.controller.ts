import { NextFunction, Request, Response } from 'express';
import GeneralSettingsService from '@/services/generalSettings.service';

class GeneralSettingsController {
  public generalSettingsService = new GeneralSettingsService();

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = await this.generalSettingsService.getAll();
      res.status(200).json({ data: settings, message: 'getAllSettings' });
    } catch (error) {
      next(error);
    }
  };

  public getByKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { key } = req.params;
      const setting = await this.generalSettingsService.getByKey(key);
      res.status(200).json({ data: setting, message: 'getSettingByKey' });
    } catch (error) {
      next(error);
    }
  };

  public upsert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { key, value, group_name } = req.body;
      const result = await this.generalSettingsService.upsert(key, value, group_name);
      res.status(200).json({ data: result, message: 'upsertSetting' });
    } catch (error) {
      next(error);
    }
  };

  public bulkUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { settings } = req.body;
      if (!Array.isArray(settings)) {
        throw new Error('Settings must be an array');
      }
      const results = await this.generalSettingsService.bulkUpdate(settings);
      res.status(200).json({ data: results, message: 'bulkUpdateSettings' });
    } catch (error) {
      next(error);
    }
  };
}

export default GeneralSettingsController;
