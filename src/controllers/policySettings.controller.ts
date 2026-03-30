import { NextFunction, Request, Response } from 'express';
import PolicySettingsService from '@/services/policySettings.service';
import { PolicyGlobalSettings, PolicyPage } from '@/interfaces/policySettings.interface';

class PolicySettingsController {
  public policySettingsService = new PolicySettingsService();

  // 1. Global Settings
  public getGlobalSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings: PolicyGlobalSettings = await this.policySettingsService.getGlobalSettings();
      res.status(200).json({ data: settings, message: 'getGlobalSettings' });
    } catch (error) {
      next(error);
    }
  };

  public updateGlobalSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settingsData: Partial<PolicyGlobalSettings> = req.body;
      const updatedSettings = await this.policySettingsService.updateGlobalSettings(settingsData);
      res.status(200).json({ data: updatedSettings, message: 'updateGlobalSettings' });
    } catch (error) {
      next(error);
    }
  };

  // 2. Policy Pages CRUD
  public getPolicyPages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pages: PolicyPage[] = await this.policySettingsService.getAllPolicyPages();
      res.status(200).json({ data: pages, message: 'getPolicyPages' });
    } catch (error) {
      next(error);
    }
  };

  public createPolicyPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pageData: Partial<PolicyPage> = req.body;
      const newPage = await this.policySettingsService.createPolicyPage(pageData);
      res.status(201).json({ data: newPage, message: 'createPolicyPage' });
    } catch (error) {
      next(error);
    }
  };

  public updatePolicyPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const pageData: Partial<PolicyPage> = req.body;
      const updatedPage = await this.policySettingsService.updatePolicyPage(id, pageData);
      res.status(200).json({ data: updatedPage, message: 'updatePolicyPage' });
    } catch (error) {
      next(error);
    }
  };

  public deletePolicyPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.policySettingsService.deletePolicyPage(id);
      res.status(200).json({ message: 'deletePolicyPage' });
    } catch (error) {
      next(error);
    }
  };
}

export default PolicySettingsController;
