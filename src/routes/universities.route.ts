import { Router } from "express";
import { UniversityController } from "@/controllers/universities.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class UniversityRoute implements Route {
  public path = "/api/universities";
  public router = Router();
  public universityController = new UniversityController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET all universities and metrics
    this.router.get("/metrics", this.universityController.getMetrics);
    this.router.get("/export/data", this.universityController.exportUniversities);
    this.router.get("/", this.universityController.getAllUniversities);

    // GET university by ID
    this.router.get("/:id", this.universityController.getUniversityById);

    // POST create university and bulk import
    this.router.post("/import", this.universityController.importUniversities);
    this.router.post("/", this.universityController.createUniversity);

    // PUT update university
    this.router.put("/:id", this.universityController.updateUniversity);

    // DELETE university
    this.router.delete("/:id", this.universityController.deleteUniversity);
  }
}
