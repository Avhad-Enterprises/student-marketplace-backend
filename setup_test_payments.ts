import DB from './src/database';

async function setupTestPayments() {
  try {
    const testPayments = [
      {
        id: 888881,
        student_db_id: 999991, // Student A
        payment_id: 'PAY-A-001',
        invoice_number: 'INV-A-001',
        description: 'Tuition Fee - Sem 1',
        amount: 5000.00,
        currency: 'USD',
        status: 'paid',
        payment_method: 'bank_transfer',
        due_date: '2025-09-01',
        paid_date: '2025-08-15',
        created_by: 'admin'
      },
      {
        id: 888882,
        student_db_id: 999991, // Student A
        payment_id: 'PAY-A-002',
        invoice_number: 'INV-A-002',
        description: 'Service Fee',
        amount: 500.00,
        currency: 'USD',
        status: 'pending',
        payment_method: 'credit_card',
        due_date: '2025-10-01',
        created_by: 'admin'
      },
      {
        id: 888883,
        student_db_id: 999992, // Student B
        payment_id: 'PAY-B-001',
        invoice_number: 'INV-B-001',
        description: 'Application Fee',
        amount: 250.00,
        currency: 'GBP',
        status: 'paid',
        payment_method: 'stripe',
        due_date: '2025-08-01',
        paid_date: '2025-07-20',
        created_by: 'admin'
      }
    ];

    for (const payment of testPayments) {
      const exists = await DB('payments').where({ id: payment.id }).first();
      if (exists) {
        await DB('payments').where({ id: payment.id }).update(payment);
        console.log(`Updated payment: ${payment.payment_id}`);
      } else {
        await DB('payments').insert(payment);
        console.log(`Created payment: ${payment.payment_id}`);
      }
    }

    console.log('Test payments setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during payments setup:', error);
    process.exit(1);
  }
}

setupTestPayments();
