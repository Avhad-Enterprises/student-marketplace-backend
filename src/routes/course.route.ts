import { Router } from "express";
import { CourseController } from "@/controllers/course.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateCourseDto, UpdateCourseDto } from "@/dtos/course.dto";

export class CourseRoute implements Route {
    public path = "/api/courses";
    public router = Router();
    public courseController = new CourseController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all course routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get("/", this.courseController.getAllCourses);
        this.router.get("/metrics", this.courseController.getCourseMetrics);
        this.router.get("/:id", this.courseController.getCourseById);

        // Administrative & Provider Actions (+ Validation)
        this.router.post("/", roleMiddleware(['admin', 'provider']), validationMiddleware(CreateCourseDto, 'body'), this.courseController.createCourse);
        this.router.put("/:id", roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateCourseDto, 'body'), this.courseController.updateCourse);
        this.router.delete("/:id", roleMiddleware(['admin', 'provider']), this.courseController.deleteCourse);
    }
}
