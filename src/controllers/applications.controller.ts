import { Request, Response, NextFunction } from "express";
import { ApplicationService } from "@/services/applications.service";

export class ApplicationController {
  private applicationService = new ApplicationService();

  // GET all applications
  public getAllApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        student_id,
        sort = "created_at",
        order = "desc",
      } = req.query;

      const result = await this.applicationService.findAll(
        Number(page),
        Number(limit),
        search as string,
        status as string,
        student_id as string,
        sort as string,
        order as string
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET application metrics
  public getMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await this.applicationService.getMetrics();
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  };

  // GET application by ID
  public getApplicationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const application = await this.applicationService.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (err) {
      next(err);
    }
  };

  // POST create application
  public createApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.applicationService.create(req.body);
      res.status(201).json({
        id: result.id,
        application_id: result.application_id,
        message: "Application created",
      });
    } catch (err) {
      next(err);
    }
  };

  // PUT update application
  public updateApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const application = await this.applicationService.update(req.params.id, req.body);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json({ message: "Application updated" });
    } catch (err) {
      next(err);
    }
  };

  // DELETE application
  public deleteApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.applicationService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json({ message: "Application deleted" });
    } catch (err) {
      next(err);
    }
  };
}
