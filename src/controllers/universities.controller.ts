import { Request, Response, NextFunction } from "express";
import { UniversityService } from "@/services/universities.service";

export class UniversityController {
  private universityService = new UniversityService();

  // GET all universities
  public getAllUniversities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        country_id,
        type,
        status,
        sort = "name",
        order = "asc",
        application_status,
      } = req.query;

      const result = await this.universityService.findAll(
        Number(page),
        Number(limit),
        search as string,
        country_id as string,
        type as string,
        status as string,
        sort as string,
        order as string,
        application_status as string
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET university metrics
  public getMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await this.universityService.getMetrics();
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  };

  // GET university by ID
  public getUniversityById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const university = await this.universityService.findById(req.params.id);
      if (!university) {
        return res.status(404).json({ error: "University not found" });
      }
      res.json(university);
    } catch (err) {
      next(err);
    }
  };

  // POST create university
  public createUniversity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.universityService.create(req.body);
      if (!result) {
        return res.status(500).json({ error: "Failed to create university" });
      }
      res.status(201).json({ id: result.id, message: "University created" });
    } catch (err) {
      next(err);
    }
  };

  // PUT update university
  public updateUniversity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const university = await this.universityService.update(req.params.id, req.body);
      if (!university) {
        return res.status(404).json({ error: "University not found" });
      }
      res.json({ message: "University updated" });
    } catch (err) {
      next(err);
    }
  };

  // DELETE university
  public deleteUniversity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.universityService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "University not found" });
      }
      res.json({ message: "University deleted" });
    } catch (err) {
      next(err);
    }
  };

  // POST import universities
  public importUniversities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: "Input must be an array" });
      }

      const count = await this.universityService.importUniversities(req.body);
      res.status(201).json({ message: `Imported ${count} universities` });
    } catch (err) {
      next(err);
    }
  };

  // GET export universities
  public exportUniversities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.universityService.exportUniversities();
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
}
