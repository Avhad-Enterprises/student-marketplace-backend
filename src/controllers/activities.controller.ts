import { Request, Response, NextFunction } from "express";
import { ActivityService } from "@/services/activities.service";

export class ActivityController {
  private activityService = new ActivityService();

  // GET all activities for a student
  public getActivitiesByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activities = await this.activityService.findByStudentId(req.params.student_id);
      res.json(activities);
    } catch (err) {
      next(err);
    }
  };

  // POST create activity
  public createActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activity = await this.activityService.create(req.body);
      res.status(201).json(activity);
    } catch (err) {
      next(err);
    }
  };

  // PUT update activity
  public updateActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activity = await this.activityService.update(req.params.id, req.body);
      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      }
      res.json(activity);
    } catch (err) {
      next(err);
    }
  };

  // DELETE activity
  public deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.activityService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Activity not found" });
      }
      res.json({ message: "Activity deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}
