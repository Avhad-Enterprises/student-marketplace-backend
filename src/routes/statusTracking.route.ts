import { Router } from "express";
import { StatusTrackingController } from "@/controllers/statusTracking.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { UpdateStatusTrackingDto } from "@/dtos/statusTracking.dto";

export class StatusTrackingRoute implements Route {
  public path = "/api/status-tracking";
  public router = Router();
  public statusTrackingController = new StatusTrackingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all status tracking routes
    this.router.use(authMiddleware);

    // Publicly accessible by authenticated users (specific to the student)
    this.router.get("/student/:studentId", this.statusTrackingController.getStatusByStudentId);

    // Administrative Actions (Admin only + Validation)
    this.router.get("/metrics", roleMiddleware(['admin']), this.statusTrackingController.getMetrics);
    this.router.get("/all", roleMiddleware(['admin']), this.statusTrackingController.getAllStatusTracking);
    this.router.post("/update", roleMiddleware(['admin']), validationMiddleware(UpdateStatusTrackingDto, 'body'), this.statusTrackingController.updateStatus);
  }
}
