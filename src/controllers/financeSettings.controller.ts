import { NextFunction, Request, Response } from 'express';
import FinanceSettingsService from '@/services/financeSettings.service';
import { FinanceSettings } from '@/interfaces/financeSettings.interface';

class FinanceSettingsController {
    public financeSettingsService = new FinanceSettingsService();

    public getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settings: FinanceSettings = await this.financeSettingsService.getSettings();
            res.status(200).json({ data: settings, message: 'getSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settingsData: Partial<FinanceSettings> = req.body;
            const updatedSettings: FinanceSettings = await this.financeSettingsService.updateSettings(settingsData);
            res.status(200).json({ data: updatedSettings, message: 'updateSettings' });
        } catch (error) {
            next(error);
        }
    };
}

export default FinanceSettingsController;
