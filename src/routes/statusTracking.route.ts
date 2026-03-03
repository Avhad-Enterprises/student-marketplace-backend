import { Router } from "express";
import { StatusTrackingController } from "@/controllers/statusTracking.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class StatusTrackingRoute implements Route {
  public path = "/api/status-tracking";
  public router = Router();
  public statusTrackingController = new StatusTrackingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET metrics
    this.router.get("/metrics", this.statusTrackingController.getMetrics);

    // GET status tracking with filters
    this.router.get("/all", this.statusTrackingController.getAllStatusTracking);

    // GET status history by student ID
    this.router.get("/student/:studentId", this.statusTrackingController.getStatusByStudentId);

    // POST update status
    this.router.post("/update", this.statusTrackingController.updateStatus);
  }
}
