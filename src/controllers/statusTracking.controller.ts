import { Request, Response, NextFunction } from "express";
import { StatusTrackingService } from "@/services/statusTracking.service";

export class StatusTrackingController {
  private statusTrackingService = new StatusTrackingService();

  // GET status history by student ID
  public getStatusByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = await this.statusTrackingService.findByStudentId(req.params.studentId);
      res.json(history);
    } catch (err) {
      next(err);
    }
  };

  // GET all status tracking
  public getAllStatusTracking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { stage, risk_level, search } = req.query;

      const result = await this.statusTrackingService.findAll(
        stage as string,
        risk_level as string,
        search as string
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // POST update status
  public updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentDbId, stage, subStatus, notes, changedBy } = req.body;

      const result = await this.statusTrackingService.updateStatus(
        studentDbId,
        stage,
        subStatus,
        notes,
        changedBy
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET metrics
  public getMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await this.statusTrackingService.getMetrics();
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  };
}
