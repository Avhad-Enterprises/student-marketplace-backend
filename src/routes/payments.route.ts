import { Router } from "express";
import { PaymentController } from "@/controllers/payments.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import roleMiddleware from "@/middlewares/role.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreatePaymentDto, UpdatePaymentDto } from "@/dtos/payments.dto";

export class PaymentRoute implements Route {
  public path = "/api/payments";
  public router = Router();
  public paymentController = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Apply authMiddleware to all payment routes
    this.router.use(authMiddleware);

    // Publicly accessible by authenticated users
    this.router.get("/invoice/:id", this.paymentController.getPaymentById);
    this.router.get("/:studentDbId/summary", this.paymentController.getPaymentSummary);
    this.router.get("/:studentDbId", this.paymentController.getPaymentsByStudentId);

    // Administrative Actions (Admin only + Validation)
    this.router.get("/", roleMiddleware(['admin']), this.paymentController.getAllPayments);
    this.router.post("/", roleMiddleware(['admin']), validationMiddleware(CreatePaymentDto, 'body'), this.paymentController.createPayment);
    this.router.put("/:id", roleMiddleware(['admin']), validationMiddleware(UpdatePaymentDto, 'body'), this.paymentController.updatePayment);
    this.router.delete("/:id", roleMiddleware(['admin']), this.paymentController.deletePayment);
  }
}
