import { Router } from "express";
import { CountryController } from "@/controllers/countries.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class CountryRoute implements Route {
  public path = "/api/countries";
  public router = Router();
  public countryController = new CountryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET all countries and metrics
    this.router.get("/metrics", this.countryController.getMetrics);
    this.router.get("/export/data", this.countryController.exportCountries);
    this.router.post("/bulk-update", this.countryController.bulkUpdateCountries);
    this.router.get("/", this.countryController.getAllCountries);



    // GET country by ID
    this.router.get("/:id", this.countryController.getCountryById);

    // POST create country and bulk import
    this.router.post("/import", this.countryController.importCountries);
    this.router.post("/", this.countryController.createCountry);

    // PUT update country
    this.router.put("/:id", this.countryController.updateCountry);

    // DELETE country
    this.router.delete("/:id", this.countryController.deleteCountry);
  }
}
