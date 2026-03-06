import { Router } from 'express';
import { BookingController } from '@/controllers/booking.controller';
import Routes from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

export class BookingRoute implements Routes {
    public path = '/api/bookings';
    public router = Router();
    public bookingController = new BookingController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/`, authMiddleware, this.bookingController.getAllBookings);
        this.router.get(`/:id`, authMiddleware, this.bookingController.getBookingById);
        this.router.post(`/`, authMiddleware, this.bookingController.createBooking);
        this.router.post(`/:id`, authMiddleware, this.bookingController.updateBooking);
        this.router.delete(`/:id`, authMiddleware, this.bookingController.deleteBooking);
    }
}
