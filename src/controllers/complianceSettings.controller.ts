import { NextFunction, Request, Response } from 'express';
import ComplianceSettingsService from '@/services/complianceSettings.service';
import { ComplianceSettings } from '@/interfaces/complianceSettings.interface';

class ComplianceSettingsController {
    public complianceSettingsService = new ComplianceSettingsService();

    public getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settings: ComplianceSettings = await this.complianceSettingsService.getSettings();
            res.status(200).json({ data: settings, message: 'getSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const settingsData: Partial<ComplianceSettings> = req.body;
            const updatedSettings: ComplianceSettings = await this.complianceSettingsService.updateSettings(settingsData);
            res.status(200).json({ data: updatedSettings, message: 'updateSettings' });
        } catch (error) {
            next(error);
        }
    };
}

export default ComplianceSettingsController;
