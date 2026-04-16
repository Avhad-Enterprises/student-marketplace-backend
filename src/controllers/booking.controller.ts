import { Request, Response, NextFunction } from "express";
import { BookingService } from '@/services/booking.service';
import { ExportRunner, ExportOptions } from '@/utils/exportRunner';

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

    public importBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = req.body;
            if (!Array.isArray(data)) {
                res.status(400).json({ message: 'Input data must be an array' });
                return;
            }
            const result = await this.bookingService.importBookings(data);
            res.status(200).json({ data: result, message: 'importBookings' });
        } catch (error) {
            next(error);
        }
    };

    public exportBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await this.bookingService.exportBookings(req.query);
            
            const keyMap = {
                'id': 'booking_id',
                'dateTime': 'date_time',
                'studentName': 'student_name',
                'service': 'service',
                'expert': 'expert',
                'status': 'status',
                'mode': 'mode',
                'source': 'source'
            };

            const result = await ExportRunner.run(data, req.query as unknown as ExportOptions, 'Bookings', keyMap);
            
            res.setHeader('Content-Type', result.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename=bookings-export-${Date.now()}.${result.extension}`);
            res.status(200).send(result.data);
        } catch (error) {
            next(error);
        }
    };
}
