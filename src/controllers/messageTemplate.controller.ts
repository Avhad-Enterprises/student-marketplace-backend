import { NextFunction, Request, Response } from 'express';
import MessageTemplateService from '@/services/messageTemplate.service';

export class MessageTemplateController {
  public service = new MessageTemplateService();

  public getTemplates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getTemplates();
      res.status(200).json({ data, message: 'getTemplates' });
    } catch (error) {
      next(error);
    }
  };

  public getTemplateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.service.getTemplateById(id);
      res.status(200).json({ data, message: 'getTemplateById' });
    } catch (error) {
      next(error);
    }
  };

  public createTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templateData = req.body;
      const data = await this.service.createTemplate(templateData);
      res.status(201).json({ data, message: 'createTemplate' });
    } catch (error) {
      next(error);
    }
  };

  public updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const templateData = req.body;
      const data = await this.service.updateTemplate(id, templateData);
      res.status(200).json({ data, message: 'updateTemplate' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.deleteTemplate(id);
      res.status(200).json({ message: 'deleteTemplate' });
    } catch (error) {
      next(error);
    }
  };
}
