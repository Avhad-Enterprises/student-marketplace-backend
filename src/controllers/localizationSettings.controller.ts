import { NextFunction, Request, Response } from 'express';
import LocalizationSettingsService from '@/services/localizationSettings.service';
import { LocalizationSettings } from '@/interfaces/localizationSettings.interface';

class LocalizationSettingsController {
    public localizationSettingsService = new LocalizationSettingsService();

    public getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settings: LocalizationSettings = await this.localizationSettingsService.getSettings();
            res.status(200).json({ data: settings, message: 'getSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settingsData: Partial<LocalizationSettings> = req.body;
            const updatedSettings: LocalizationSettings = await this.localizationSettingsService.updateSettings(settingsData);
            res.status(200).json({ data: updatedSettings, message: 'updateSettings' });
        } catch (error) {
            next(error);
        }
    };
}

export default LocalizationSettingsController;
