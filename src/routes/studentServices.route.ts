import { Router } from "express";
import { StudentServicesController } from "@/controllers/studentServices.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateStudentServiceDto, UpdateStudentServiceDto } from "@/dtos/studentServices.dto";

export class StudentServicesRoute implements Route {
  public path = "/api/services";
  public router = Router();
  public studentServicesController = new StudentServicesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all student services routes
    this.router.use(authMiddleware);

    // Publicly accessible by authenticated users (specific to the student)
    this.router.get("/:studentDbId", this.studentServicesController.getServicesByStudentId);

    // Administrative Actions (Admin only + Validation)
    this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateStudentServiceDto, 'body'), this.studentServicesController.createService);
    this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateStudentServiceDto, 'body'), this.studentServicesController.updateService);
    this.router.delete("/:id", roleMiddleware(['admin']), this.studentServicesController.deleteService);
  }
}
