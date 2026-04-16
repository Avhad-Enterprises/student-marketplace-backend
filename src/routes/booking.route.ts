import { Router } from 'express';
import { BookingController } from '@/controllers/booking.controller';
import Routes from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import roleMiddleware from '@/middlewares/role.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateBookingDto, UpdateBookingDto } from '@/dtos/booking.dto';

export class BookingRoute implements Routes {
    public path = '/api/bookings';
    public router = Router();
    public bookingController = new BookingController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply authMiddleware to all booking routes
        this.router.use(authMiddleware);

        // Global list and individual view (Admin only until schema supports student ID)
        this.router.get(`/`, roleMiddleware(['admin']), this.bookingController.getAllBookings);
        this.router.get(`/:id`, roleMiddleware(['admin']), this.bookingController.getBookingById);

        // Administrative Actions (Admin only + Validation)
        this.router.post(`/`, roleMiddleware(['admin']), validationMiddleware(CreateBookingDto, 'body'), this.bookingController.createBooking);
        this.router.post(`/import`, roleMiddleware(['admin']), this.bookingController.importBookings);
        this.router.post(`/:id`, roleMiddleware(['admin']), validationMiddleware(UpdateBookingDto, 'body'), this.bookingController.updateBooking);
        this.router.delete(`/:id`, roleMiddleware(['admin']), this.bookingController.deleteBooking);
    }
}
