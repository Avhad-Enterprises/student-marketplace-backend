import DB from "@/database";
import { Booking } from "@/interfaces/booking.interface";

export class BookingService {
    public async getAllBookings(): Promise<Booking[]> {
        const bookings: Booking[] = await DB('bookings').select('*').orderBy('date_time', 'desc');
        return bookings;
    }

    public async getBookingById(id: string): Promise<Booking> {
        const booking: Booking = await DB('bookings').where({ booking_id: id }).first();
        return booking;
    }

    public async createBooking(bookingData: Booking): Promise<Booking> {
        await DB('bookings').insert({
            ...bookingData,
            created_at: new Date(),
            updated_at: new Date()
        });
        return this.getBookingById(bookingData.booking_id);
    }

    public async updateBooking(id: string, bookingData: Partial<Booking>): Promise<Booking> {
        await DB('bookings').where({ booking_id: id }).update({
            ...bookingData,
            updated_at: new Date()
        });
        return this.getBookingById(id);
    }

    public async deleteBooking(id: string): Promise<void> {
        await DB('bookings').where({ booking_id: id }).delete();
    }
}
