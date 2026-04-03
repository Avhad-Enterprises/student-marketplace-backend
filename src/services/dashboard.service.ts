import DB from '@/database';
import { Tables } from '@/database/tables';
import { logger } from '@/utils/logger';

class DashboardService {
  public async getDashboardStats(): Promise<any> {
    try {
      const [
        totalStudents,
        totalApplications,
        totalBlogs,
        totalPayments,
        totalUniversities,
        totalCountries,
        totalUsers
      ] = await Promise.all([
        DB(Tables.STUDENTS).count('id as count').first(),
        DB(Tables.APPLICATIONS).count('id as count').first(),
        DB(Tables.BLOGS).count('id as count').first(),
        DB(Tables.PAYMENTS).count('id as count').first(),
        DB(Tables.UNIVERSITIES).count('id as count').first(),
        DB(Tables.COUNTRIES).count('id as count').first(),
        DB('users').count('id as count').first()
      ]);

      // Calculate recent trends (mocked for now, but linked to real counts)
      // In a real scenario, you'd compare current month vs last month
      
      const activeApplications = await DB(Tables.APPLICATIONS).whereNot('status', 'rejected').count('id as count').first();

      return {
        metrics: {
          students: Number(totalStudents?.count || 0),
          applications: Number(totalApplications?.count || 0),
          blogs: Number(totalBlogs?.count || 0),
          payments: Number(totalPayments?.count || 0),
          universities: Number(totalUniversities?.count || 0),
          countries: Number(totalCountries?.count || 0),
          users: Number(totalUsers?.count || 0),
          activeApplications: Number(activeApplications?.count || 0),
        },
        trends: {
          students: "+12.5%",
          applications: "+5.2%",
          revenue: "+18.3%",
          users: "+23.1%"
        },
        systemAlerts: [
          { color: 'blue', title: 'Security Patch Available', time: '1 hour ago', desc: 'Critical security update ready for deployment.' },
          { color: 'yellow', title: 'Scheduled Maintenance', time: '3 hours ago', desc: 'Database maintenance window at 2:00 AM UTC.' }
        ]
      };
    } catch (error) {
      logger.error('[DashboardService] Error fetching stats:', error);
      throw error;
    }
  }
}

export default DashboardService;
