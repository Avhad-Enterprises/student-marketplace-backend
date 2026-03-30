import { NextFunction, Request, Response } from 'express';
import ComparisonRulesService from '@/services/comparisonRules.service';

class ComparisonRulesController {
    public rulesService = new ComparisonRulesService();

    public getRules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await this.rulesService.getRules();
            res.status(200).json({ data, message: 'getComparisonRules' });
        } catch (error) {
            next(error);
        }
    };

    public updateRules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const rulesData = req.body;
            const data = await this.rulesService.updateRules(rulesData);
            res.status(200).json({ data, message: 'updateComparisonRules' });
        } catch (error) {
            next(error);
        }
    };
}

export default ComparisonRulesController;
