import DB from './src/database';

async function setupTestEnquiries() {
  try {
    const testEnquiries = [
      {
        id: 444441,
        enquiry_id: 'ENQ-001',
        student_name: 'Student A',
        email: 'student.a@test.com',
        subject: 'Visa Query',
        message: 'I have a question about my Canada visa.',
        priority: 'high',
        status: 'open',
        date_submitted: new Date()
      },
      {
        id: 444442,
        enquiry_id: 'ENQ-002',
        student_name: 'Student B',
        email: 'student.b@test.com',
        subject: 'Housing Help',
        message: 'I need help finding a room in London.',
        priority: 'medium',
        status: 'pending',
        date_submitted: new Date()
      }
    ];

    for (const enq of testEnquiries) {
      const exists = await DB('enquiries').where({ id: enq.id }).first();
      if (exists) {
        await DB('enquiries').where({ id: enq.id }).update(enq);
        console.log(`Updated Enquiry: ${enq.enquiry_id}`);
      } else {
        await DB('enquiries').insert(enq);
        console.log(`Created Enquiry: ${enq.enquiry_id}`);
      }
    }

    console.log('Test enquiries setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during enquiry setup:', error);
    process.exit(1);
  }
}

setupTestEnquiries();
