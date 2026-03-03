import { Request, Response, NextFunction } from "express";
import { PartnerService } from "@/services/partners.service";

export class PartnerController {
  private partnerService = new PartnerService();

  // GET all partners for a student
  public getPartnersByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const partners = await this.partnerService.findByStudentId(req.params.student_id);
      res.json(partners);
    } catch (err) {
      next(err);
    }
  };

  // POST create partner
  public createPartner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const partner = await this.partnerService.create(req.body);
      res.status(201).json(partner);
    } catch (err) {
      next(err);
    }
  };

  // PUT update partner
  public updatePartner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const partner = await this.partnerService.update(req.params.id, req.body);
      if (!partner) {
        return res.status(404).json({ error: "Partner not found" });
      }
      res.json(partner);
    } catch (err) {
      next(err);
    }
  };

  // DELETE partner
  public deletePartner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.partnerService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Partner not found" });
      }
      res.json({ message: "Partner deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}
