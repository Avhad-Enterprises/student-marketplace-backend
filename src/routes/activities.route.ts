import { Router } from "express";
import { ActivityController } from "@/controllers/activities.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class ActivityRoute implements Route {
  public path = "/api/activities";
  public router = Router();
  public activityController = new ActivityController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET all activities for a student
    this.router.get("/:student_id", this.activityController.getActivitiesByStudentId);

    // POST create activity
    this.router.post("/", this.activityController.createActivity);

    // PUT update activity
    this.router.put("/:id", this.activityController.updateActivity);

    // DELETE activity
    this.router.delete("/:id", this.activityController.deleteActivity);
  }
}
