import { Request, Response, NextFunction } from "express";
import { PaymentService } from "@/services/payments.service";
import { StudentService } from "@/services/students.service";

export class PaymentController {
  private paymentService = new PaymentService();
  private studentService = new StudentService();

  // GET all payments
  public getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await this.paymentService.findAll();
      res.json(payments);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/payments/invoice/:id
  public getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await this.paymentService.findById(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(payment);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/payments/:studentDbId
  public getPaymentsByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const studentDbId = req.params.studentDbId;

      // 1. Mandatory User Existence Check (401)
      if (!user) {
        return res.status(401).json({ error: "Unauthorized: Authentication required" });
      }

      // 2. Fetch Student Metadata (BEFORE fetching payments)
      const student = await this.studentService.findById(studentDbId);
      if (!student) {
        return res.status(404).json({ error: "Record not found" });
      }

      // 3. Ownership Validation (Admin bypass OR student_code match)
      const isAdmin = (user as any).user_type === 'admin' || user.role === 'admin';
      const isOwner = user.student_code && student.student_id && 
                      user.student_code.toLowerCase() === student.student_id.toLowerCase();

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: "Forbidden: Access denied" });
      }

      // 4. Fetch Payments (ONLY after successful validation)
      const payments = await this.paymentService.findByStudentId(studentDbId);
      res.json(payments);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/payments/:studentDbId/summary
  public getPaymentSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const studentDbId = req.params.studentDbId;

      // 1. Mandatory User Existence Check (401)
      if (!user) {
        return res.status(401).json({ error: "Unauthorized: Authentication required" });
      }

      // 2. Fetch Student Metadata (BEFORE fetching summary)
      const student = await this.studentService.findById(studentDbId);
      if (!student) {
        return res.status(404).json({ error: "Record not found" });
      }

      // 3. Ownership Validation (Admin bypass OR student_code match)
      const isAdmin = (user as any).user_type === 'admin' || user.role === 'admin';
      const isOwner = user.student_code && student.student_id && 
                      user.student_code.toLowerCase() === student.student_id.toLowerCase();

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: "Forbidden: Access denied" });
      }

      // 4. Fetch Summary (ONLY after successful validation)
      const summary = await this.paymentService.getPaymentSummary(studentDbId);
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
