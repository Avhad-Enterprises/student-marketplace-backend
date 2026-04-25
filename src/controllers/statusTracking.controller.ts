import { Request, Response, NextFunction } from "express";
import { StatusTrackingService } from "@/services/statusTracking.service";
import { ExportRunner, ExportOptions } from "@/utils/exportRunner";

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
      const { stage, risk_level, search, page, limit, sort, order } = req.query;

      const result = await this.statusTrackingService.findAll({
        stage: stage as string,
        risk_level: risk_level as string,
        search: search as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        sort: sort as string,
        order: (order as string) === 'asc' ? 'asc' : 'desc'
      });

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

  public getMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await this.statusTrackingService.getMetrics();
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  };

  // GET export leads
  public exportLeads = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let ids: (string | number)[] | undefined;
      const { ids: queryIds, stage, risk_level, search } = req.query;

      if (queryIds && typeof queryIds === 'string') {
        ids = queryIds.split(",");
      }

      const data = await this.statusTrackingService.exportLeads(
        ids,
        stage as string,
        risk_level as string,
        search as string
      );

      const keyMap = {
        'student_id': 'student_id',
        'first_name': 'first_name',
        'last_name': 'last_name',
        'email': 'email',
        'risk_level': 'risk_level',
        'stage': 'stage',
        'country': 'country',
        'counselor': 'counselor',
        'sub_status': 'sub_status',
        'last_update': 'last_update',
        'last_notes': 'last_notes'
      };

      const result = await ExportRunner.run(data, req.query as unknown as ExportOptions, 'Leads', keyMap);
      
      res.setHeader('Content-Type', result.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename=leads-export-${Date.now()}.${result.extension}`);
      res.status(200).send(result.data);
    } catch (err) {
      next(err);
    }
  };
}

export default StatusTrackingController;
