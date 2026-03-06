import { Router } from "express";
import { PaymentController } from "@/controllers/payments.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";

export class PaymentRoute implements Route {
  public path = "/api/payments";
  public router = Router();
  public paymentController = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);

    // GET all payments
    this.router.get("/", this.paymentController.getAllPayments);

    // GET payment summary for a student (before :studentDbId so it takes priority)
    this.router.get("/:studentDbId/summary", this.paymentController.getPaymentSummary);

    // GET all payments for a student
    this.router.get("/:studentDbId", this.paymentController.getPaymentsByStudentId);

    // POST create payment
    this.router.post("/", this.paymentController.createPayment);

    // PUT update payment
    this.router.put("/:id", this.paymentController.updatePayment);

    // DELETE payment
    this.router.delete("/:id", this.paymentController.deletePayment);
  }
}
