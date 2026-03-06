import { NextFunction, Request, Response } from 'express';
import SystemSettingsService from '@/services/systemSettings.service';

class SystemSettingsController {
    public systemSettingsService = new SystemSettingsService();

    public getSystemSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await this.systemSettingsService.getSystemSettings();
            res.status(200).json({ data, message: 'getSystemSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSystemSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settingsData = req.body;
            const data = await this.systemSettingsService.updateSystemSettings(settingsData);
            res.status(200).json({ data, message: 'updateSystemSettings' });
        } catch (error) {
            next(error);
        }
    };

    public getNotificationSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await this.systemSettingsService.getNotificationSettings();
            res.status(200).json({ data, message: 'getNotificationSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateNotificationSetting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { key } = req.params;
            const { enabled } = req.body;
            const data = await this.systemSettingsService.updateNotificationSetting(key, enabled);
            res.status(200).json({ data, message: 'updateNotificationSetting' });
        } catch (error) {
            next(error);
        }
    };
}

export default SystemSettingsController;
