import { NextFunction, Request, Response } from 'express';
import { BookingService } from '@/services/booking.service';

export class BookingController {
    public bookingService = new BookingService();

    public getAllBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bookings = await this.bookingService.getAllBookings();
            res.status(200).json({ data: bookings, message: 'getAllBookings' });
        } catch (error) {
            next(error);
        }
    };

    public getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bookingId = req.params.id;
            const booking = await this.bookingService.getBookingById(bookingId);
            res.status(200).json({ data: booking, message: 'getBookingById' });
        } catch (error) {
            next(error);
        }
    };

    public createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bookingData = req.body;
            const newBooking = await this.bookingService.createBooking(bookingData);
            res.status(201).json({ data: newBooking, message: 'createBooking' });
        } catch (error) {
            next(error);
        }
    };

    public updateBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bookingId = req.params.id;
            const bookingData = req.body;
            const updatedBooking = await this.bookingService.updateBooking(bookingId, bookingData);
            res.status(200).json({ data: updatedBooking, message: 'updateBooking' });
        } catch (error) {
            next(error);
        }
    };
    public deleteBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bookingId = req.params.id;
            await this.bookingService.deleteBooking(bookingId);
            res.status(200).json({ message: 'deleteBooking' });
        } catch (error) {
            next(error);
        }
    };
}
