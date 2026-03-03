import { Router } from "express";
import { CourseController } from "@/controllers/course.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class CourseRoute implements Route {
    public path = "/api/courses";
    public router = Router();
    public courseController = new CourseController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);

        this.router.get("/", this.courseController.getAllCourses);
        this.router.get("/metrics", this.courseController.getCourseMetrics);
        this.router.get("/:id", this.courseController.getCourseById);
        this.router.post("/", this.courseController.createCourse);
        this.router.put("/:id", this.courseController.updateCourse);
        this.router.delete("/:id", this.courseController.deleteCourse);
    }
}
