import { Router } from "express";
import { CountryController } from "@/controllers/countries.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateCountryDto, UpdateCountryDto } from "@/dtos/countries.dto";

export class CountryRoute implements Route {
  public path = "/api/countries";
  public router = Router();
  public countryController = new CountryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all country routes
    this.router.use(authMiddleware);

    // GET all countries and metrics (Accessible by authenticated users)
    this.router.get("/metrics", this.countryController.getMetrics);
    this.router.get("/", this.countryController.getAllCountries);
    
    // GET country by ID
    this.router.get("/:id", this.countryController.getCountryById);

    // Administrative Actions (Admin only)
    this.router.get("/export/data", roleMiddleware(['admin']), this.countryController.exportCountries);
    this.router.post("/import", roleMiddleware(['admin']), this.countryController.importCountries);
    this.router.post("/bulk-update", roleMiddleware(['admin']), this.countryController.bulkUpdateCountries);
    
    // Create & Update (Admin only + Validation)
    this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreateCountryDto, 'body'), this.countryController.createCountry);
    this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdateCountryDto, 'body'), this.countryController.updateCountry);

    // DELETE country (Admin only)
    this.router.delete("/:id", roleMiddleware(['admin']), this.countryController.deleteCountry);
  }
}
