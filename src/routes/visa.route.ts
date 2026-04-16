import { Router } from "express";
import { VisaController } from "@/controllers/visa.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateVisaDto, UpdateVisaDto } from "@/dtos/visa.dto";

export class VisaRoute implements Route {
    public path = "/api/visa";
    public router = Router();
    public visaController = new VisaController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all visa routes
        this.router.use(authMiddleware);

        // Publicly accessible by authenticated users
        this.router.get("/metrics", this.visaController.getMetrics);
        this.router.get("/", this.visaController.getAllVisas);
        this.router.get("/:id", this.visaController.getVisaById);

        // Administrative & Provider Actions (+ Validation)
        this.router.get("/export", roleMiddleware(['admin', 'provider']), this.visaController.exportVisa);
        this.router.post("/", roleMiddleware(['admin', 'provider']), validationMiddleware(CreateVisaDto, 'body'), this.visaController.createVisa);
        this.router.put("/:id", roleMiddleware(['admin', 'provider']), validationMiddleware(UpdateVisaDto, 'body'), this.visaController.updateVisa);
        this.router.delete("/:id", roleMiddleware(['admin', 'provider']), this.visaController.deleteVisa);
    }
}
