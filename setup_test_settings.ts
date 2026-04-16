import DB from './src/database';

async function setupTestSettings() {
  try {
    const testSettings = {
      id: 1,
      platform_name: 'QA Test Platform',
      stripe_secret_key: 'sk_test_QA_SECRET_STRIPE',
      aws_secret_key: 'QA_SECRET_AWS_KEY',
      smtp_pass: 'QA_SECRET_SMTP_PASS',
      maintenance_mode: false
    };

    const exists = await DB('system_settings').where({ id: 1 }).first();
    if (exists) {
      await DB('system_settings').where({ id: 1 }).update(testSettings);
      console.log('Updated system settings with QA secrets.');
    } else {
      await DB('system_settings').insert(testSettings);
      console.log('Created system settings with QA secrets.');
    }

    console.log('Test Settings data setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during settings setup:', error);
    process.exit(1);
  }
}

setupTestSettings();
