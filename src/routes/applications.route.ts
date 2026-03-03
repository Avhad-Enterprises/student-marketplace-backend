import { Router } from "express";
import { ApplicationController } from "@/controllers/applications.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class ApplicationRoute implements Route {
  public path = "/api/applications";
  public router = Router();
  public applicationController = new ApplicationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET all applications and metrics
    this.router.get("/metrics", this.applicationController.getMetrics);
    this.router.get("/", this.applicationController.getAllApplications);

    // GET application by ID
    this.router.get("/:id", this.applicationController.getApplicationById);

    // POST create application
    this.router.post("/", this.applicationController.createApplication);

    // PUT update application
    this.router.put("/:id", this.applicationController.updateApplication);

    // DELETE application
    this.router.delete("/:id", this.applicationController.deleteApplication);
  }
}
