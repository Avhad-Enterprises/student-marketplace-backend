import { NextFunction, Request, Response } from 'express';
import AiTestScoringService from '@/services/aiTestScoring.service';

export class AiTestScoringController {
    public aiTestScoringService = new AiTestScoringService();

    public getSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const settings = await this.aiTestScoringService.getSettings();
            res.status(200).json({ data: settings, message: 'getSettings' });
        } catch (error) {
            next(error);
        }
    };

    public updateSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const settingsData = req.body;
            console.log('Attempting to update settings with:', JSON.stringify(settingsData, null, 2));
            const updatedSettings = await this.aiTestScoringService.updateSettings(settingsData);

            if (!updatedSettings) {
                console.error('Update failed: No settings returned from service');
                throw new Error('Failed to update settings - record not found');
            }

            console.log('Successfully updated settings');
            res.status(200).json({ data: updatedSettings, message: 'updateSettings' });
        } catch (error) {
            console.error('Error in AiTestScoringController.updateSettings:', error);
            next(error);
        }
    };
}
