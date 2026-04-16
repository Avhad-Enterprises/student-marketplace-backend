import { Request, Response, NextFunction } from "express";
import { PartnerService } from "@/services/partners.service";

export class PartnerController {
  private partnerService = new PartnerService();

  // GET all partners with pagination/search/RBAC
  public getAllPartners = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string;
        const status = req.query.status as string;
        const partner_type = req.query.partner_type as string;
        const sort = req.query.sort as string;
        const order = req.query.order as string;
        const user = (req as any).user;

        const result = await this.partnerService.findAll(page, limit, search, status, partner_type, sort, order, user?.user_type, user?.id);

        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
  };

  // GET partner metrics
  public getPartnerMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const metrics = await this.partnerService.getMetrics();
        res.status(200).json({ success: true, data: metrics });
    } catch (error) {
        next(error);
    }
  };

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
      const user = (req as any).user;
      const partner = await this.partnerService.update(req.params.id, req.body, user?.user_type, user?.id);
      if (!partner) {
        return res.status(404).json({ success: false, message: "Partner not found or unauthorized" });
      }
      res.json({ success: true, data: partner });
    } catch (err) {
      next(err);
    }
  };

  // DELETE partner
  public deletePartner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const deletedRow = await this.partnerService.delete(req.params.id, user?.user_type, user?.id);
      if (!deletedRow) {
        return res.status(404).json({ success: false, message: "Partner not found or unauthorized" });
      }
      res.json({ success: true, message: "Partner deleted successfully" });
    } catch (err) {
      next(err);
    }
  };

  // GET partner performance (for redesigned Overview)
  public getPartnerPerformance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const performance = await this.partnerService.getPerformance(req.params.id);
        
        if (!performance) {
            return res.status(404).json({ success: false, message: "Partner not found" });
        }

        // RBAC: Provider only sees their own performance
        if (user?.user_type === 'provider' && String(performance.id) !== String(user.id)) {
            return res.status(403).json({ success: false, message: "Unauthorized access to performance data" });
        }

        res.status(200).json({ success: true, data: performance });
    } catch (error) {
        next(error);
    }
  };
}
