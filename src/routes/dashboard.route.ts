import { Router } from "express";
import DashboardController from "@/controllers/dashboard.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";

export class DashboardRoute implements Route {
  public path = "/api/dashboard";
  public router = Router();
  public dashboardController = new DashboardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // All dashboard endpoints require admin privileges
    this.router.use(authMiddleware, roleMiddleware(['admin']));

    // Legacy endpoint — kept for backwards compatibility
    this.router.get("/stats", this.dashboardController.getDashboardStats as any);

    // New granular endpoints
    this.router.get("/summary",     this.dashboardController.getSummary as any);
    this.router.get("/alerts",      this.dashboardController.getAlerts as any);
    this.router.get("/insights",    this.dashboardController.getInsights as any);
    this.router.get("/admin-users", this.dashboardController.getAdminUsers as any);

    // Debug ping
    this.router.get("/ping", (req, res) => {
      res.status(200).json({ message: "Dashboard API is reachable" });
    });
  }
}
