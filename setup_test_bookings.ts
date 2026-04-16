import DB from './src/database';

async function setupTestBookings() {
  try {
    const testBookings = [
      {
        id: 666661,
        booking_id: 'BK-TEST-001',
        student_name: 'Student A',
        service: 'SOP Review',
        expert: 'Test Expert A',
        date_time: new Date('2025-10-10T10:00:00Z'),
        status: 'upcoming',
        mode: 'online',
        source: 'web'
      },
      {
        id: 666662,
        booking_id: 'BK-TEST-002',
        student_name: 'Student B',
        service: 'Visa Consulting',
        expert: 'Test Expert B',
        date_time: new Date('2025-11-11T11:00:00Z'),
        status: 'completed',
        mode: 'offline',
        source: 'mobile'
      }
    ];

    for (const booking of testBookings) {
      const exists = await DB('bookings').where({ id: booking.id }).first();
      if (exists) {
        await DB('bookings').where({ id: booking.id }).update(booking);
        console.log(`Updated Booking: ${booking.booking_id}`);
      } else {
        await DB('bookings').insert(booking);
        console.log(`Created Booking: ${booking.booking_id}`);
      }
    }

    console.log('Test bookings setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during booking setup:', error);
    process.exit(1);
  }
}

setupTestBookings();
