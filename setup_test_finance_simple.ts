import DB from './src/database';

async function setupTestFinance() {
  try {
    const bank = {
      bank_id: 'BNK-TEST-99',
      bank_name: 'Test Bank',
      status: 'active'
    };
    await DB('banks').insert(bank);
    console.log('Created Simple Bank');

    const loan = {
      loan_id: 'LON-TEST-99',
      provider_name: 'Test Loan',
      status: 'active'
    };
    await DB('loans').insert(loan);
    console.log('Created Simple Loan');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupTestFinance();
