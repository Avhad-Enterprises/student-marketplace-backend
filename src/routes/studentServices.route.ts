import { Router } from "express";
import { StudentServicesController } from "@/controllers/studentServices.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class StudentServicesRoute implements Route {
  public path = "/api/services";
  public router = Router();
  public studentServicesController = new StudentServicesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET all services for a student
    this.router.get("/:studentDbId", this.studentServicesController.getServicesByStudentId);

    // POST create service
    this.router.post("/", this.studentServicesController.createService);

    // PUT update service
    this.router.put("/:id", this.studentServicesController.updateService);

    // DELETE service
    this.router.delete("/:id", this.studentServicesController.deleteService);
  }
}
