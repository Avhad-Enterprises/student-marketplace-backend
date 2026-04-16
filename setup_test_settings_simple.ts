import DB from './src/database';

async function setupTestSettings() {
  try {
    const testSettings = {
      id: 1,
      platform_name: 'QA Test Platform'
    };

    const exists = await DB('system_settings').where({ id: 1 }).first();
    if (exists) {
      await DB('system_settings').where({ id: 1 }).update(testSettings);
      console.log('Updated system settings.');
    } else {
      await DB('system_settings').insert(testSettings);
      console.log('Created system settings.');
    }

    console.log('Test Settings data setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during settings setup:', error);
    process.exit(1);
  }
}

setupTestSettings();
