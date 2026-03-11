import { NextFunction, Request, Response } from 'express';
import AiTestPlansService from '@/services/aiTestPlans.service';

export class AiTestPlansController {
    public aiTestPlansService = new AiTestPlansService();

    public getSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const settings = await this.aiTestPlansService.getSettings();
            res.status(200).json({ data: settings, message: 'getSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const settingsData = req.body;
            const updateSettingsData = await this.aiTestPlansService.updateSettings(settingsData);
            res.status(200).json({ data: updateSettingsData, message: 'updateSettings' });
        } catch (error) {
            next(error);
        }
    };
}
