import { NextFunction, Request, Response } from 'express';
import IntegrationSettingsService from '@/services/integrationSettings.service';
import { IntegrationSettings } from '@/interfaces/integrationSettings.interface';

class IntegrationSettingsController {
    public integrationSettingsService = new IntegrationSettingsService();

    public getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settings: IntegrationSettings = await this.integrationSettingsService.getSettings();
            res.status(200).json({ data: settings, message: 'getSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settingsData: Partial<IntegrationSettings> = req.body;
            const updatedSettings: IntegrationSettings = await this.integrationSettingsService.updateSettings(settingsData);
            res.status(200).json({ data: updatedSettings, message: 'updateSettings' });
        } catch (error) {
            next(error);
        }
    };
}

export default IntegrationSettingsController;
