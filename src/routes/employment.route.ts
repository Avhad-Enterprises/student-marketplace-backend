import { Router } from "express";
import { EmploymentController } from "@/controllers/employment.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class EmploymentRoute implements Route {
    public path = "/api/employment";
    public router = Router();
    public employmentController = new EmploymentController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);

        this.router.get("/", this.employmentController.getAllEmployment);
        this.router.get("/metrics", this.employmentController.getEmploymentMetrics);
        this.router.get("/:id", this.employmentController.getEmploymentById);
        this.router.post("/", this.employmentController.createEmployment);
        this.router.put("/:id", this.employmentController.updateEmployment);
        this.router.delete("/:id", this.employmentController.deleteEmployment);
    }
}
