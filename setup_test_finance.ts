import DB from './src/database';

async function setupTestFinance() {
  try {
    const testBanks = [
      {
        id: 333331,
        bank_id: 'BNK-001',
        bank_name: 'Test Bank A',
        account_type: 'Student Account',
        countries_covered: 'United Kingdom',
        status: 'active'
      }
    ];

    const testLoans = [
      {
        id: 222221,
        loan_id: 'LON-001',
        provider_name: 'Test Loan Provider',
        product_name: 'Education Loan Gold',
        amount_range: '10000-50000',
        countries_supported: 'India, UK',
        status: 'active'
      }
    ];

    for (const bank of testBanks) {
      const exists = await DB('banks').where({ id: bank.id }).first();
      if (exists) {
        await DB('banks').where({ id: bank.id }).update(bank);
        console.log(`Updated Bank: ${bank.bank_id}`);
      } else {
        await DB('banks').insert(bank);
        console.log(`Created Bank: ${bank.bank_id}`);
      }
    }

    for (const loan of testLoans) {
      const exists = await DB('loans').where({ id: loan.id }).first();
      if (exists) {
        await DB('loans').where({ id: loan.id }).update(loan);
        console.log(`Updated Loan: ${loan.loan_id}`);
      } else {
        await DB('loans').insert(loan);
        console.log(`Created Loan: ${loan.loan_id}`);
      }
    }

    console.log('Finance test data setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during finance setup:', error);
    process.exit(1);
  }
}

setupTestFinance();
