import DB from './src/database';

async function setupTestServices() {
  try {
    const testServices = [
      {
        id: 555551,
        student_db_id: 999991, // Student A
        service_type: 'accommodation',
        service_name: 'Student Housing - London',
        provider: 'Liberty Living',
        status: 'active',
        start_date: '2025-09-01',
        amount: 800.00,
        currency: 'GBP'
      },
      {
        id: 555552,
        student_db_id: 999992, // Student B
        service_type: 'sim_card',
        service_name: 'UK SIM Card - 50GB',
        provider: 'EE',
        status: 'pending',
        start_date: '2025-08-15',
        amount: 20.00,
        currency: 'GBP'
      }
    ];

    for (const service of testServices) {
      const exists = await DB('student_services').where({ id: service.id }).first();
      if (exists) {
        await DB('student_services').where({ id: service.id }).update(service);
        console.log(`Updated Student Service: ${service.id}`);
      } else {
        await DB('student_services').insert(service);
        console.log(`Created Student Service: ${service.id}`);
      }
    }

    console.log('Test services setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during services setup:', error);
    process.exit(1);
  }
}

setupTestServices();
