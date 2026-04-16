import { Router } from "express";
import { ApplicationController } from "@/controllers/applications.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateApplicationDto, UpdateApplicationDto } from "@/dtos/applications.dto";

export class ApplicationRoute implements Route {
  public path = "/api/applications";
  public router = Router();
  public applicationController = new ApplicationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all application routes
    this.router.use(authMiddleware);

    // GET all applications and metrics
    this.router.get("/metrics", this.applicationController.getMetrics);
    this.router.get("/", this.applicationController.getAllApplications);

    // GET application by ID
    this.router.get("/:id", this.applicationController.getApplicationById);

    // POST create application (Admin only + Validation)
    this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateApplicationDto, 'body'), this.applicationController.createApplication);

    // PUT update application (Admin only + Validation)
    this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateApplicationDto, 'body'), this.applicationController.updateApplication);

    // DELETE application (Admin only)
    this.router.delete("/:id", roleMiddleware(['admin']), this.applicationController.deleteApplication);
  }
}
