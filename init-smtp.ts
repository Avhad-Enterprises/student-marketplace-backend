import { IntegrationsService } from './src/communications/services/integrations.service';
import dotenv from 'dotenv';

dotenv.config();

const integrationsService = new IntegrationsService();

async function initSmtp() {
  console.log('Initializing SMTP configuration...');
  
  const config = {
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: 'sendmailtest@test-zone.xyz',
      pass: 'pI25mkvBpq/#'
    },
    from_email: 'sendmailtest@test-zone.xyz',
    from_name: 'Student Marketplace'
  };

  try {
    const result = await integrationsService.updateConfig('email', 'smtp', config, null);
    console.log('SMTP Configuration updated successfully:', result);
    process.exit(0);
  } catch (error) {
    console.error('Failed to update SMTP configuration:', error);
    process.exit(1);
  }
}

initSmtp();
