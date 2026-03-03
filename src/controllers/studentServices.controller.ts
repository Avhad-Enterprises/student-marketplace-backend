import { Request, Response, NextFunction } from "express";
import { StudentServicesService } from "@/services/studentServices.service";

export class StudentServicesController {
  private studentServicesService = new StudentServicesService();

  // GET all services for a student
  public getServicesByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const services = await this.studentServicesService.findByStudentId(req.params.studentDbId);
      res.json(services);
    } catch (err) {
      next(err);
    }
  };

  // POST create service
  public createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = await this.studentServicesService.create(req.body);
      res.status(201).json(service);
    } catch (err) {
      next(err);
    }
  };

  // PUT update service
  public updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = await this.studentServicesService.update(req.params.id, req.body);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (err) {
      next(err);
    }
  };

  // DELETE service
  public deleteService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.studentServicesService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json({ message: "Service deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}
