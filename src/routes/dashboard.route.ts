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
    // Legacy endpoint — kept for backwards compatibility
    this.router.get("/stats", authMiddleware as any, this.dashboardController.getDashboardStats as any);

    // New granular endpoints
    this.router.get("/summary",     authMiddleware as any, this.dashboardController.getSummary as any);
    this.router.get("/alerts",      authMiddleware as any, this.dashboardController.getAlerts as any);
    this.router.get("/insights",    authMiddleware as any, this.dashboardController.getInsights as any);
    this.router.get("/admin-users", authMiddleware as any, this.dashboardController.getAdminUsers as any);

    // Debug ping
    this.router.get("/ping", (req, res) => {
      res.status(200).json({ message: "Dashboard API is reachable" });
    });
  }
}
