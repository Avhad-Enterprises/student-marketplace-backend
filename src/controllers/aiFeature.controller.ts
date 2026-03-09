import { NextFunction, Request, Response } from 'express';
import { AiFeatureService } from '@/services/aiFeature.service';

export class AiFeatureController {
    public aiFeatureService = new AiFeatureService();

    public getAllFeatures = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const features = await this.aiFeatureService.getAllFeatures();
            res.status(200).json({ data: features, message: 'getAllFeatures' });
        } catch (error) {
            next(error);
        }
    };

    public getFeatureById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const featureId = req.params.id;
            const feature = await this.aiFeatureService.getFeatureById(featureId);
            res.status(200).json({ data: feature, message: 'getFeatureById' });
        } catch (error) {
            next(error);
        }
    };

    public updateFeature = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const featureId = req.params.id;
            const featureData = req.body;
            const updatedFeature = await this.aiFeatureService.updateFeature(featureId, featureData);
            res.status(200).json({ data: updatedFeature, message: 'updateFeature' });
        } catch (error) {
            next(error);
        }
    };

    public createFeature = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const featureData = req.body;
            const newFeature = await this.aiFeatureService.createFeature(featureData);
            res.status(201).json({ data: newFeature, message: 'createFeature' });
        } catch (error) {
            next(error);
        }
    };

    public deleteFeature = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const featureId = req.params.id;
            await this.aiFeatureService.deleteFeature(featureId);
            res.status(200).json({ message: 'deleteFeature' });
        } catch (error) {
            next(error);
        }
    };
}
