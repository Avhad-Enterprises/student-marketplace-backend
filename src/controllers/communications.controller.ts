import { Request, Response, NextFunction } from "express";
import { CommunicationService } from "@/services/communications.service";

export class CommunicationController {
  private communicationService = new CommunicationService();

  // GET communication by ID
  public getCommunicationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const communication = await this.communicationService.findById(req.params.id);
      if (!communication) {
        return res.status(404).json({ error: "Communication not found" });
      }
      res.json(communication);
    } catch (err) {
      next(err);
    }
  };

  // GET all communications
  public getCommunications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const communications = await this.communicationService.findAll();
      res.json(communications);
    } catch (err) {
      next(err);
    }
  };

  // GET all communications for a student
  public getCommunicationsByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const communications = await this.communicationService.findByStudentId(
        req.params.student_id
      );
      res.json(communications);
    } catch (err) {
      next(err);
    }
  };

  // POST create communication
  public createCommunication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const communication = await this.communicationService.create(req.body);
      res.status(201).json(communication);
    } catch (err) {
      next(err);
    }
  };

  // PUT update communication
  public updateCommunication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const communication = await this.communicationService.update(req.params.id, req.body);
      if (!communication) {
        return res.status(404).json({ error: "Communication not found" });
      }
      res.json(communication);
    } catch (err) {
      next(err);
    }
  };

  // DELETE communication
  public deleteCommunication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.communicationService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Communication not found" });
      }
      res.json({ message: "Communication deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}
