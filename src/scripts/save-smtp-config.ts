import db from '@/database';
import { IntegrationsService } from '@/communications/services/integrations.service';

const integrationsService = new IntegrationsService();

async function run() {
  console.log("Saving SMTP config to database...");
  try {
    const config = {
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      username: 'sendmailtest@test-zone.xyz',
      password: 'pI25mkvBpq/#',
      from_email: 'sendmailtest@test-zone.xyz',
      from_name: 'Student Marketplace'
    };

    const res = await integrationsService.updateConfig('email', 'smtp', config);
    console.log("Config saved successfully:", res);
  } catch (err) {
    console.error("Error saving config:", err);
  } finally {
    process.exit(0);
  }
}

run();
