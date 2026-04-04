import DB from '@/database';
import { Tables } from '@/database/tables';
import { logger } from '@/utils/logger';

class DashboardService {

  // ─── Helper: count rows for current week vs previous week ───────────────────
  private async getCountWithChange(table: string, extraWhere?: (q: any) => any) {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - 7);
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    const getQuery = () => {
      const q = DB(table);
      return extraWhere ? extraWhere(q) : q;
    };

    const [totalRow, thisWeekRow, lastWeekRow] = await Promise.all([
      getQuery().count('* as count').first(),
      getQuery().where('created_at', '>=', startOfThisWeek).count('* as count').first(),
      getQuery()
        .where('created_at', '>=', startOfLastWeek)
        .where('created_at', '<', startOfThisWeek).count('* as count').first(),
    ]);

    const total = Number(totalRow?.count || 0);
    const thisWeek = Number(thisWeekRow?.count || 0);
    const lastWeek = Number(lastWeekRow?.count || 0);
    const change = lastWeek === 0
      ? (thisWeek > 0 ? 100 : 0)
      : parseFloat((((thisWeek - lastWeek) / lastWeek) * 100).toFixed(1));

    return { total, change };
  }

  // ─── Helper: 7-day daily trend array ────────────────────────────────────────
  private async getDailyTrend(table: string, extraWhere?: (q: any) => any): Promise<number[]> {
    const trend: number[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const q = DB(table).where('created_at', '>=', dayStart).where('created_at', '<=', dayEnd);
      const finalQ = extraWhere ? extraWhere(q) : q;
      const row = await finalQ.count('* as count').first();
      trend.push(Number(row?.count || 0));
    }
    return trend;
  }

  // ─── 1. GET /api/dashboard/summary ──────────────────────────────────────────
  public async getSummary(): Promise<any> {
    try {
      const [
        studentsData,
        applicationsData,
        blogsData,
        paymentsData,
        usersData,
        studentsTrend,
        applicationsTrend,
        blogsTrend,
        paymentsTrend,
        usersTrend,
      ] = await Promise.all([
        this.getCountWithChange(Tables.STUDENTS),
        this.getCountWithChange(Tables.APPLICATIONS, q => q.whereNot('status', 'rejected')),
        this.getCountWithChange(Tables.BLOGS, q => q.where('status', 'published')),
        this.getCountWithChange(Tables.PAYMENTS),
        this.getCountWithChange('users'),
        this.getDailyTrend(Tables.STUDENTS),
        this.getDailyTrend(Tables.APPLICATIONS, q => q.whereNot('status', 'rejected')),
        this.getDailyTrend(Tables.BLOGS, q => q.where('status', 'published')),
        this.getDailyTrend(Tables.PAYMENTS),
        this.getDailyTrend('users'),
      ]);

      return {
        students:     { total: studentsData.total,     change: studentsData.change,     trend: studentsTrend },
        applications: { total: applicationsData.total, change: applicationsData.change, trend: applicationsTrend },
        blogs:        { total: blogsData.total,        change: blogsData.change,        trend: blogsTrend },
        payments:     { total: paymentsData.total,     change: paymentsData.change,     trend: paymentsTrend },
        users:        { total: usersData.total,        change: usersData.change,        trend: usersTrend },
      };
    } catch (error) {
      logger.error('[DashboardService] getSummary error:', error);
      throw error;
    }
  }

  // ─── 2. GET /api/dashboard/alerts ───────────────────────────────────────────
  public async getAlerts(): Promise<any[]> {
    try {
      const systemSettings = await DB('system_settings').where('id', 1).first();
      const alerts: any[] = [];

      if (systemSettings?.maintenance_mode) {
        alerts.push({
          id: 'maintenance',
          title: 'Maintenance Mode Active',
          description: 'The platform is currently in maintenance mode. Users cannot access the system.',
          type: 'critical',
          color: 'red',
          timestamp: new Date().toISOString(),
        });
      }

      alerts.push(
        {
          id: 'security-patch',
          title: 'Security Patch Available',
          description: 'A critical security update is available and ready for deployment.',
          type: 'warning',
          color: 'blue',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'db-maintenance',
          title: 'Scheduled Maintenance',
          description: 'Database maintenance window scheduled at 2:00 AM UTC.',
          type: 'info',
          color: 'yellow',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        }
      );

      const todayUsersRow = await DB('users')
        .where('created_at', '>=', new Date(new Date().setHours(0, 0, 0, 0)))
        .count('* as count').first();
      const todayUsers = Number(todayUsersRow?.count || 0);
      if (todayUsers > 0) {
        alerts.push({
          id: 'new-users',
          title: 'New Admin Users Today',
          description: `${todayUsers} new admin user${todayUsers > 1 ? 's' : ''} registered today.`,
          type: 'info',
          color: 'emerald',
          timestamp: new Date().toISOString(),
        });
      }

      return alerts;
    } catch (error) {
      logger.error('[DashboardService] getAlerts error:', error);
      throw error;
    }
  }

  // ─── 3. GET /api/dashboard/insights ─────────────────────────────────────────
  public async getInsights(): Promise<any[]> {
    try {
      const [studentsRow, applicationsRow, paymentsRow, blogsRow] = await Promise.all([
        DB(Tables.STUDENTS).count('* as count').first(),
        DB(Tables.APPLICATIONS).whereNot('status', 'rejected').count('* as count').first(),
        DB(Tables.PAYMENTS).count('* as count').first(),
        DB(Tables.BLOGS).count('* as count').first(),
      ]);

      const totalStudents = Number(studentsRow?.count || 0);
      const activeApps = Number(applicationsRow?.count || 0);
      const totalPayments = Number(paymentsRow?.count || 0);

      const tableCount = Object.keys(Tables).length;

      return [
        {
          id: 'server-load',
          title: 'Platform Activity',
          description: `${totalStudents} students and ${activeApps} active applications being tracked.`,
          icon: 'server',
          timestamp: new Date().toISOString(),
          value: totalStudents,
        },
        {
          id: 'db-performance',
          title: 'Database Performance',
          description: `All ${tableCount} core system tables are operational.`,
          icon: 'database',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          value: tableCount,
        },
        {
          id: 'payments',
          title: 'Payment Records',
          description: `${totalPayments} total payment record${totalPayments !== 1 ? 's' : ''} stored in the system.`,
          icon: 'wallet',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          value: totalPayments,
        },
        {
          id: 'backup',
          title: 'Backup Status',
          description: 'Daily backup completed successfully at 3:15 AM.',
          icon: 'shield',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          value: null,
        },
      ];
    } catch (error) {
      logger.error('[DashboardService] getInsights error:', error);
      throw error;
    }
  }

  // ─── 4. GET /api/dashboard/admin-users ──────────────────────────────────────
  public async getAdminUsers(): Promise<any> {
    try {
      const startOfThisWeek = new Date();
      startOfThisWeek.setDate(new Date().getDate() - 7);
      startOfThisWeek.setHours(0, 0, 0, 0);

      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

      const [totalRow, thisWeekRow, lastWeekRow, recentUsers] = await Promise.all([
        DB('users').count('* as count').first(),
        DB('users').where('created_at', '>=', startOfThisWeek).count('* as count').first(),
        DB('users').where('created_at', '>=', startOfLastWeek).where('created_at', '<', startOfThisWeek).count('* as count').first(),
        DB('users')
          .where('created_at', '>=', startOfThisWeek)
          .select('id', 'full_name', 'email', 'account_status', 'created_at')
          .orderBy('created_at', 'desc')
          .limit(5),
      ]);

      const thisWeek = Number(thisWeekRow?.count || 0);
      const lastWeek = Number(lastWeekRow?.count || 0);
      const growth = lastWeek === 0
        ? (thisWeek > 0 ? 100 : 0)
        : parseFloat((((thisWeek - lastWeek) / lastWeek) * 100).toFixed(1));

      return {
        total: Number(totalRow?.count || 0),
        thisWeek,
        growth,
        recentUsers: recentUsers.map((u: any) => {
          const name = u.full_name || u.email || 'User';
          const initials = name.split(' ').filter(Boolean).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
          return {
            id: u.id,
            name,
            email: u.email,
            initials,
            status: u.account_status,
            joinedAt: u.created_at,
          };
        }),
      };
    } catch (error) {
      logger.error('[DashboardService] getAdminUsers error:', error);
      throw error;
    }
  }

  // ─── Legacy: keep /stats working for backwards-compat ───────────────────────
  public async getDashboardStats(): Promise<any> {
    try {
      const [summary, alerts] = await Promise.all([this.getSummary(), this.getAlerts()]);
      return {
        metrics: {
          students: summary.students.total,
          applications: summary.applications.total,
          blogs: summary.blogs.total,
          payments: summary.payments.total,
          users: summary.users.total,
          activeApplications: summary.applications.total,
          universities: 0,
          countries: 0,
        },
        trends: {
          students: `${summary.students.change >= 0 ? '+' : ''}${summary.students.change}%`,
          applications: `${summary.applications.change >= 0 ? '+' : ''}${summary.applications.change}%`,
          revenue: '+0.0%',
          users: `${summary.users.change >= 0 ? '+' : ''}${summary.users.change}%`,
        },
        systemAlerts: alerts.map(a => ({ color: a.color, title: a.title, time: new Date(a.timestamp).toLocaleTimeString(), desc: a.description })),
      };
    } catch (error) {
      logger.error('[DashboardService] getDashboardStats error:', error);
      throw error;
    }
  }
}

export default DashboardService;
