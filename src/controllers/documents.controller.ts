import { Request, Response, NextFunction } from "express";
import { DocumentService } from "@/services/documents.service";
import { MinioService } from "@/services/minio.service";

export class DocumentController {
  private documentService = new DocumentService();
  private minioService = new MinioService();

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
      const document = await this.documentService.findById(req.params.id);
      if (document && document.file_url) {
        await this.minioService.deleteFile(document.file_url);
      }
      
      const deleted = await this.documentService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json({ message: "Document deleted successfully" });
    } catch (err) {
      next(err);
    }
  };

  // POST upload document
  public uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentName = req.body.studentName;
      const studentDbId = req.body.studentDbId;
      const category = req.body.category || 'other';
      const uploadedBy = req.body.uploadedBy || 'system';
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!studentName) {
        return res.status(400).json({ error: "Student name is required for folder creation" });
      }

      // Upload to Minio
      const objectName = await this.minioService.uploadFile(studentName, file);

      // Save to Database
      const documentData = {
        studentDbId,
        name: file.originalname,
        category,
        status: 'active',
        file_type: file.mimetype,
        file_size: file.size,
        uploaded_by: uploadedBy,
        file_url: objectName, // Store object name as file_url
      };

      const document = await this.documentService.create(documentData);

      // Get presigned URL for response
      const presignedUrl = await this.minioService.getPresignedUrl(objectName);

      res.status(201).json({
        ...document,
        download_url: presignedUrl
      });
    } catch (err) {
      next(err);
    }
  };

  // GET document URL (fetch)
  public getDocumentUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await this.documentService.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      const presignedUrl = await this.minioService.getPresignedUrl(document.file_url);
      res.json({
        ...document,
        download_url: presignedUrl
      });
    } catch (err) {
      next(err);
    }
  };
}
