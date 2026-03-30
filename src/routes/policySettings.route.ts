import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import PolicySettingsController from '@/controllers/policySettings.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class PolicySettingsRoute implements Route {
  public path = '/api/settings/policies';
  public router = Router();
  public policySettingsController = new PolicySettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Global Settings
    this.router.get(`/global`, authMiddleware, this.policySettingsController.getGlobalSettings);
    this.router.post(`/global`, authMiddleware, this.policySettingsController.updateGlobalSettings);
    
    // Policy Pages CRUD
    this.router.get(`/pages`, authMiddleware, this.policySettingsController.getPolicyPages);
    this.router.post(`/pages`, authMiddleware, this.policySettingsController.createPolicyPage);
    this.router.put(`/pages/:id`, authMiddleware, this.policySettingsController.updatePolicyPage);
    this.router.delete(`/pages/:id`, authMiddleware, this.policySettingsController.deletePolicyPage);
  }
}

export default PolicySettingsRoute;
