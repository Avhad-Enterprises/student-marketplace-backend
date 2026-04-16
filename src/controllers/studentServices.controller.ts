import { Request, Response, NextFunction } from "express";
import { StudentServicesService } from "@/services/studentServices.service";

export class StudentServicesController {
  private studentServicesService = new StudentServicesService();

  // GET all services for a student
  public getServicesByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const isAdmin = user?.user_type === 'admin' || user?.role === 'admin';
      const studentDbId = req.params.studentDbId;
      const services: any[] = await this.studentServicesService.findByStudentId(studentDbId);

      if (services.length > 0) {
          // Ownership Validation
          const isOwner = user?.student_code && services[0].student_id && 
                          user.student_code.toLowerCase() === services[0].student_id.toLowerCase();
          if (!isAdmin && !isOwner) {
              return res.status(403).json({ error: "Forbidden: Access denied" });
          }
      }

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
