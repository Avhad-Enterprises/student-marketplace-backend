import { Router } from "express";
import { InsuranceController } from "@/controllers/insurance.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class InsuranceRoute implements Route {
    public path = "/api/insurance";
    public router = Router();
    public insuranceController = new InsuranceController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);

        this.router.get("/", this.insuranceController.getInsurance);
        this.router.get("/metrics", this.insuranceController.getMetrics);
        this.router.get("/:id", this.insuranceController.getInsuranceById);
        this.router.post("/", this.insuranceController.createInsurance);
        this.router.put("/:id", this.insuranceController.updateInsurance);
        this.router.delete("/:id", this.insuranceController.deleteInsurance);
    }
}
