import { Request, Response, NextFunction } from "express";
import { PaymentService } from "@/services/payments.service";

export class PaymentController {
  private paymentService = new PaymentService();

  // GET all payments for a student
  public getPaymentsByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await this.paymentService.findByStudentId(req.params.studentDbId);
      res.json(payments);
    } catch (err) {
      next(err);
    }
  };

  // GET payment summary for a student
  public getPaymentSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await this.paymentService.getPaymentSummary(req.params.studentDbId);
      res.json(summary);
    } catch (err) {
      next(err);
    }
  };

  // POST create payment
  public createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await this.paymentService.create(req.body);
      res.status(201).json(payment);
    } catch (err) {
      next(err);
    }
  };

  // PUT update payment
  public updatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await this.paymentService.update(req.params.id, req.body);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(payment);
    } catch (err) {
      next(err);
    }
  };

  // DELETE payment
  public deletePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.paymentService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json({ message: "Payment deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}
