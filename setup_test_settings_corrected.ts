import DB from './src/database';

async function setupTestSettings() {
  try {
    const testSettings = {
      id: 1,
      platform_name: 'QA Test Platform',
      // Since we can't be sure about the column names due to inconsistencies, 
      // let's just try to set the most common sensitive ones we saw in the column list.
      support_email: 'qa@test.com'
    };

    // We'll try to find which columns actually exist from our previous check
    const columns = ['stripe_secret_key', 'aws_secret_key', 'smtp_pass'];
    const currentCols = await DB('system_settings').columnInfo();
    const colsToUpdate: any = { ...testSettings };
    
    for (const col of columns) {
      if (currentCols[col]) {
          colsToUpdate[col] = `QA_SECRET_${col.toUpperCase()}`;
      }
    }

    const exists = await DB('system_settings').where({ id: 1 }).first();
    if (exists) {
      await DB('system_settings').where({ id: 1 }).update(colsToUpdate);
      console.log('Updated system settings with secrets.');
    } else {
      await DB('system_settings').insert(colsToUpdate);
      console.log('Created system settings with secrets.');
    }

    console.log('Test Settings data setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during settings setup:', error);
    process.exit(1);
  }
}

setupTestSettings();
