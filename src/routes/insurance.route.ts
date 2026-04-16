import { Router } from "express";
import { InsuranceController } from "@/controllers/insurance.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateInsuranceDto, UpdateInsuranceDto } from "@/dtos/insurance.dto";

export class InsuranceRoute implements Route {
    public path = "/api/insurance";
    public router = Router();
    public insuranceController = new InsuranceController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all insurance routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get("/", this.insuranceController.getInsurance);
        this.router.get("/metrics", this.insuranceController.getMetrics);
        this.router.get("/:id", this.insuranceController.getInsuranceById);

        // Administrative & Provider Actions (+ Validation)
        this.router.post("/", roleMiddleware(['admin', 'provider']), validationMiddleware(CreateInsuranceDto, 'body'), this.insuranceController.createInsurance);
        this.router.put("/:id", roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateInsuranceDto, 'body'), this.insuranceController.updateInsurance);
        this.router.delete("/:id", roleMiddleware(['admin', 'provider']), this.insuranceController.deleteInsurance);
    }
}
