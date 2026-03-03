import { Router } from "express";
import { DocumentController } from "@/controllers/documents.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class DocumentRoute implements Route {
  public path = "/api/documents";
  public router = Router();
  public documentController = new DocumentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET all documents for a student
    this.router.get("/:studentDbId", this.documentController.getDocumentsByStudentId);

    // POST create document
    this.router.post("/", this.documentController.createDocument);

    // PUT update document
    this.router.put("/:id", this.documentController.updateDocument);

    // DELETE document
    this.router.delete("/:id", this.documentController.deleteDocument);
  }
}
