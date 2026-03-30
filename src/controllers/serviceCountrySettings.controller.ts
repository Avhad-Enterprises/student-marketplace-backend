import { NextFunction, Request, Response } from 'express';
import ServiceCountrySettingsService from '@/services/serviceCountrySettings.service';

class ServiceCountrySettingsController {
    public serviceCountrySettingsService = new ServiceCountrySettingsService();

    public getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await this.serviceCountrySettingsService.getSettings();
            res.status(200).json({ data, message: 'getServiceCountrySettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settingsData = req.body;
            const data = await this.serviceCountrySettingsService.updateSettings(settingsData);
            res.status(200).json({ data, message: 'updateServiceCountrySettings' });
        } catch (error) {
            next(error);
        }
    };
}

export default ServiceCountrySettingsController;
