import { Router } from "express";
import { EmploymentController } from "@/controllers/employment.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateEmploymentDto, UpdateEmploymentDto } from "@/dtos/employment.dto";

export class EmploymentRoute implements Route {
    public path = "/api/employment";
    public router = Router();
    public employmentController = new EmploymentController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all employment routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get("/", this.employmentController.getAllEmployment);
        this.router.get("/metrics", this.employmentController.getEmploymentMetrics);
        this.router.get("/:id", this.employmentController.getEmploymentById);

        // Administrative & Provider Actions (+ Validation)
        this.router.post("/", roleMiddleware(['admin', 'provider']), validationMiddleware(CreateEmploymentDto, 'body'), this.employmentController.createEmployment);
        this.router.put("/:id", roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateEmploymentDto, 'body'), this.employmentController.updateEmployment);
        this.router.delete("/:id", roleMiddleware(['admin', 'provider']), this.employmentController.deleteEmployment);
    }
}
