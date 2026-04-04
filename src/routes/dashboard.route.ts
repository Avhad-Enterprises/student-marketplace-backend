import { Router } from "express";
import DashboardController from "@/controllers/dashboard.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class DashboardRoute implements Route {
  public path = "/api/dashboard";
  public router = Router();
  public dashboardController = new DashboardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Add authMiddleware to protect dashboard statistics
    this.router.get("/stats", authMiddleware, this.dashboardController.getDashboardStats);
    
    // Add a simple ping route for debugging
    this.router.get("/ping", (req, res) => {
      res.status(200).json({ message: "Dashboard API is reachable" });
    });
  }
}
