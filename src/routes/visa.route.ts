import { Router } from "express";
import { VisaController } from "@/controllers/visa.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class VisaRoute implements Route {
    public path = "/api/visa";
    public router = Router();
    public visaController = new VisaController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);

        // GET all visa types and metrics
        this.router.get("/metrics", this.visaController.getMetrics);
        this.router.get("/export", this.visaController.exportVisa);
        this.router.get("/", this.visaController.getAllVisas);

        // GET visa by ID
        this.router.get("/:id", this.visaController.getVisaById);

        // POST create visa
        this.router.post("/", this.visaController.createVisa);

        // PUT update visa
        this.router.put("/:id", this.visaController.updateVisa);

        // DELETE visa
        this.router.delete("/:id", this.visaController.deleteVisa);
    }
}
