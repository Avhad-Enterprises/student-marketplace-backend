import { Request, Response, NextFunction } from "express";
import { DocumentService } from "@/services/documents.service";

export class DocumentController {
  private documentService = new DocumentService();

  // GET all documents for a student
  public getDocumentsByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const documents = await this.documentService.findByStudentId(req.params.studentDbId);
      res.json(documents);
    } catch (err) {
      next(err);
    }
  };

  // POST create document
  public createDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await this.documentService.create(req.body);
      res.status(201).json(document);
    } catch (err) {
      next(err);
    }
  };

  // PUT update document
  public updateDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await this.documentService.update(req.params.id, req.body);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (err) {
      next(err);
    }
  };

  // DELETE document
  public deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.documentService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json({ message: "Document deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}
