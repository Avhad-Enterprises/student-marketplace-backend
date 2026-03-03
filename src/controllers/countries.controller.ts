import { Request, Response, NextFunction } from "express";
import { CountryService } from "@/services/countries.service";

export class CountryController {
  private countryService = new CountryService();

  // GET all countries
  public getAllCountries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, q, search, region, status, sort = "name", order = "asc" } = req.query;
      const searchQuery = (q as string) || (search as string);

      const result = await this.countryService.findAll(
        Number(page),
        Number(limit),
        searchQuery,
        region as string,
        status as string,
        sort as string,
        order as string
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET country metrics
  public getMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await this.countryService.getMetrics();
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  };

  // GET country by ID
  public getCountryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const country = await this.countryService.findById(req.params.id);
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
      res.json(country);
    } catch (err) {
      next(err);
    }
  };

  // POST create country
  public createCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.countryService.create(req.body);
      res.status(201).json({ id: result.id, message: "Country created" });
    } catch (err) {
      next(err);
    }
  };

  // PUT update country
  public updateCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const country = await this.countryService.update(req.params.id, req.body);
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
      res.json({ message: "Country updated" });
    } catch (err) {
      next(err);
    }
  };

  // DELETE country
  public deleteCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.countryService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Country not found" });
      }
      res.json({ message: "Country deleted" });
    } catch (err) {
      next(err);
    }
  };

  // POST import countries
  public importCountries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: "Input must be an array" });
      }

      const count = await this.countryService.importCountries(req.body);
      res.status(201).json({ message: `Imported ${count} countries` });
    } catch (err) {
      next(err);
    }
  };

  // GET export countries
  public exportCountries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let ids: (string | number)[] | undefined;
      const { ids: queryIds } = req.query;

      if (queryIds && typeof queryIds === 'string') {
        ids = queryIds.split(",");
      }

      const data = await this.countryService.exportCountries(ids);
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
  // POST bulk update countries
  public bulkUpdateCountries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids, status } = req.body;
      if (!ids || !Array.isArray(ids) || !status) {
        return res.status(400).json({ error: "Invalid input" });
      }
      const result = await this.countryService.bulkUpdate(ids, status);
      res.json({ message: `Updated ${result.length} countries` });
    } catch (err) {
      next(err);
    }
  };
}
