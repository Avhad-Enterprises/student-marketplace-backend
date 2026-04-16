import { Router } from "express";
import { PartnerController } from "@/controllers/partners.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreatePartnerDto, UpdatePartnerDto } from "@/dtos/partners.dto";

export class PartnerRoute implements Route {
  public path = "/api/partners";
  public router = Router();
  public partnerController = new PartnerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all partner routes
    this.router.use(authMiddleware);

    // GET all partners (paginated/search/RBAC)
    this.router.get("/", this.partnerController.getAllPartners);

    // GET partner metrics
    this.router.get("/metrics", this.partnerController.getPartnerMetrics);

    // GET partner performance (for redesigned Overview)
    this.router.get("/:id/performance", this.partnerController.getPartnerPerformance);

    // GET all partners for a student (Admin only - legacy/internal)
    this.router.get("/:student_id", this.partnerController.getPartnersByStudentId);

    // Administrative & Provider Actions (+ Validation)
    this.router.post("/", roleMiddleware(['admin', 'provider']), validationMiddleware(CreatePartnerDto, 'body'), this.partnerController.createPartner);
    this.router.put("/:id", roleMiddleware(['admin', 'provider']), validationMiddleware(UpdatePartnerDto, 'body'), this.partnerController.updatePartner);
    this.router.delete("/:id", roleMiddleware(['admin', 'provider']), this.partnerController.deletePartner);
  }
}
