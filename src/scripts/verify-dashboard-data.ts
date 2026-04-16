import DB from '../database';
import { Tables } from '../database/tables';
import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const API_URL = `http://localhost:${process.env.PORT || 5000}/api/dashboard`;

async function getAdminToken() {
    // We assume we can get a token or bypass it for this internal script
    // For now, we'll try to find an admin user and generate a token if needed, 
    // but the easiest is to just hit the DB directly in this script and compare with a manual API call results.
    return 'your-admin-token-here'; 
}

async function verify() {
  console.log('--- Dashboard Data Integrity Verification ---');
  
  try {
    // 1. Get Direct DB Counts
    const [dbStudents, dbApps, dbBlogs, dbPayments, dbUsers] = await Promise.all([
      DB(Tables.STUDENTS).count('* as count').first(),
      DB(Tables.APPLICATIONS).whereNot('status', 'rejected').count('* as count').first(),
      DB(Tables.BLOGS).where('status', 'published').count('* as count').first(),
      DB(Tables.PAYMENTS).count('* as count').first(),
      DB('users').count('* as count').first(),
    ]);

    const counts = {
      students: Number(dbStudents?.count || 0),
      applications: Number(dbApps?.count || 0),
      blogs: Number(dbBlogs?.count || 0),
      payments: Number(dbPayments?.count || 0),
      users: Number(dbUsers?.count || 0),
    };

    console.log('Direct DB Counts:', counts);

    // 2. Fetch Dashboard Summary (We hit the service directly to avoid Auth boilerplate in this script)
    // Actually, let's just import the service.
    const DashboardService = require('../services/dashboard.service').default;
    const service = new DashboardService();
    const summary = await service.getSummary();

    console.log('Dashboard API Summary:', {
      students: summary.students.total,
      applications: summary.applications.total,
      blogs: summary.blogs.total,
      payments: summary.payments.total,
      users: summary.users.total,
    });

    // 3. Comparison
    let hasMismatch = false;
    const fields = ['students', 'applications', 'blogs', 'payments', 'users'] as const;
    
    fields.forEach(field => {
      const dbCount = counts[field];
      const apiCount = summary[field].total;
      if (dbCount !== apiCount) {
        console.error(`❌ MISMATCH in ${field}: DB=${dbCount}, API=${apiCount}`);
        hasMismatch = true;
      } else {
        console.log(`✅ MATCH in ${field}: ${dbCount}`);
      }
    });

    if (!hasMismatch) {
      console.log('\n✨ ALL COUNTS VALIDATED SUCCESSFULLY ✨');
    } else {
      console.log('\n⚠️ DATA INTEGRITY ISSUES FOUND ⚠️');
    }

  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    process.exit(0);
  }
}

verify();
