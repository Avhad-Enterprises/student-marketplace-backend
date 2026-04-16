import { Router } from "express";
import { ActivityController } from "@/controllers/activities.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateActivityDto, UpdateActivityDto } from "@/dtos/activities.dto";

export class ActivityRoute implements Route {
  public path = "/api/activities";
  public router = Router();
  public activityController = new ActivityController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all activity routes
    this.router.use(authMiddleware);

    // Publicly accessible by authenticated users (specific to the student)
    this.router.get("/:student_id", this.activityController.getActivitiesByStudentId);

    // Administrative Actions (Admin only + Validation)
    this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateActivityDto, 'body'), this.activityController.createActivity);
    this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateActivityDto, 'body'), this.activityController.updateActivity);
    this.router.delete("/:id", roleMiddleware(['admin']), this.activityController.deleteActivity);
  }
}
