import { NextFunction, Request, Response } from 'express';
import AdminNotificationSettingsService from '@/services/adminNotificationSettings.service';
import { AdminNotificationSettings } from '@/interfaces/adminNotificationSettings.interface';

class AdminNotificationSettingsController {
    public adminNotificationSettingsService = new AdminNotificationSettingsService();

    public getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settings: AdminNotificationSettings = await this.adminNotificationSettingsService.getSettings();
            res.status(200).json({ data: settings, message: 'getSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settingsData: Partial<AdminNotificationSettings> = req.body;
            const updatedSettings: AdminNotificationSettings = await this.adminNotificationSettingsService.updateSettings(settingsData);
            res.status(200).json({ data: updatedSettings, message: 'updateSettings' });
        } catch (error) {
            next(error);
        }
    };
}

export default AdminNotificationSettingsController;
