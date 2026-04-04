import 'dotenv/config';
import DashboardService from './src/services/dashboard.service';
import { logger } from './src/utils/logger';

async function testDashboard() {
  const service = new DashboardService();
  try {
    console.log('Fetching dashboard stats...');
    const stats = await service.getDashboardStats();
    console.log('Stats fetched successfully:');
    console.log(JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  } finally {
    process.exit(0);
  }
}

testDashboard();
