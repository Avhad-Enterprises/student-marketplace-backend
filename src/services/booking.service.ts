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

    public async importBookings(data: any[]): Promise<{ success: number; failed: number; errors: string[] }> {
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        await DB.transaction(async (trx) => {
            for (const item of data) {
                try {
                    const bookingId = item.booking_id || item.bookingId;
                    if (!bookingId) throw new Error('Missing booking_id');

                    const payload: any = {
                        booking_id: bookingId,
                        date_time: item.date_time ? new Date(item.date_time) : (item.dateTime ? new Date(item.dateTime) : new Date()),
                        student_name: item.student_name || item.studentName || 'Unknown Student',
                        service: item.service || 'General Consultation',
                        expert: item.expert || 'Unassigned',
                        status: (item.status || 'upcoming').toLowerCase(),
                        mode: item.mode || 'Online',
                        source: item.source || 'regular',
                        updated_at: new Date()
                    };

                    const existing = await trx('bookings').where({ booking_id: bookingId }).first();

                    if (existing) {
                        await trx('bookings').where({ booking_id: bookingId }).update(payload);
                    } else {
                        payload.created_at = new Date();
                        await trx('bookings').insert(payload);
                    }
                    success++;
                } catch (error: any) {
                    failed++;
                    errors.push(`Row ${success + failed}: ${error.message}`);
                }
            }
        });

        return { success, failed, errors };
    }
}
