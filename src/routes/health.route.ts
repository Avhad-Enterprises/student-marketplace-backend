import { Router } from "express";

export class HealthRoute {
  public path = "/health";
  public router = Router();

  constructor() {
    this.router.get('/', (req, res) => {
      res.status(200).json({
        status: "ok",
        service: "student-marketplace-backend",
        uptime: process.uptime(),
        timestamp: new Date(),
      });
    });
  }
}
