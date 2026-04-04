import { Request, Response } from 'express';
import { AutomationRulesService } from '../services/automation-rules.service';

const automationService = new AutomationRulesService();

export class AutomationRulesController {
  async getAll(req: Request, res: Response) {
    try {
      const rules = await automationService.getAll();
      return res.status(200).json({ rules });
    } catch (error: any) {
      console.error('Error fetching automation rules:', error);
      return res.status(500).json({ message: 'Failed to fetch automation rules' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid automation rule ID' });
      }

      const rule = await automationService.getById(id);
      if (!rule) {
        return res.status(404).json({ message: 'Automation rule not found' });
      }

      return res.status(200).json({ rule });
    } catch (error: any) {
      console.error('Error fetching automation rule:', error);
      return res.status(500).json({ message: 'Failed to fetch automation rule' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const ruleData = req.body;
      const rule = await automationService.create(ruleData);
      return res.status(201).json({
        message: 'Automation rule created successfully',
        rule
      });
    } catch (error: any) {
      console.error('Error creating automation rule:', error);
      return res.status(500).json({ message: 'Failed to create automation rule' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid automation rule ID' });
      }

      const ruleData = req.body;
      const rule = await automationService.update(id, ruleData);

      if (!rule) {
        return res.status(404).json({ message: 'Automation rule not found' });
      }

      return res.status(200).json({
        message: 'Automation rule updated successfully',
        rule
      });
    } catch (error: any) {
      console.error('Error updating automation rule:', error);
      return res.status(500).json({ message: 'Failed to update automation rule' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid automation rule ID' });
      }

      await automationService.delete(id);

      return res.status(200).json({
        message: 'Automation rule deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting automation rule:', error);
      return res.status(500).json({ message: 'Failed to delete automation rule' });
    }
  }
}
