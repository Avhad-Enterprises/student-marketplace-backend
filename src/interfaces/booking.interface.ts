export interface Booking {
    id?: number;
    booking_id: string;
    date_time: Date;
    student_name: string;
    service: string;
    expert: string;
    status: 'upcoming' | 'completed' | 'cancelled' | 'no-show';
    mode: string;
    source: string;
    created_at?: Date;
    updated_at?: Date;
}
