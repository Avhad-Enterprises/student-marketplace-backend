import { Router } from "express";
import { UniversityController } from "@/controllers/universities.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateUniversityDto, UpdateUniversityDto } from "@/dtos/universities.dto";

export class UniversityRoute implements Route {
  public path = "/api/universities";
  public router = Router();
  public universityController = new UniversityController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all university routes
    this.router.use(authMiddleware);

    // GET all universities and metrics (Accessible by authenticated users)
    this.router.get("/metrics", this.universityController.getMetrics);
    this.router.get("/", this.universityController.getAllUniversities);
    
    // GET university by ID
    this.router.get("/:id", this.universityController.getUniversityById);

    // Administrative Actions (Admin only)
    this.router.get("/export", roleMiddleware(['admin']), this.universityController.exportUniversities);
    this.router.post("/import", roleMiddleware(['admin']), this.universityController.importUniversities);
    
    // Create & Update (Admin only + Validation)
    this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateUniversityDto, 'body'), this.universityController.createUniversity);
    this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateUniversityDto, 'body'), this.universityController.updateUniversity);

    // DELETE university (Admin only)
    this.router.delete("/:id", roleMiddleware(['admin']), this.universityController.deleteUniversity);
  }
}
