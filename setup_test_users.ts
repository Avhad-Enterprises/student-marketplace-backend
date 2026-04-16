import DB from './src/database';
import bcrypt from 'bcrypt';

async function setupTestUsers() {
  try {
    const passwordHash = await bcrypt.hash('Password123!', 10);
    
    // Get roles
    const adminRole = await DB('roles').where({ name: 'Super Admin' }).first();
    const anyRole = await DB('roles').first();
    
    if (!adminRole || !anyRole) {
      console.error('Roles not found');
      process.exit(1);
    }

    const studentRoleId = anyRole.id; // Fallback if no specific student role
    const adminRoleId = adminRole.id;

    const testUsers = [
      {
        id: '99999999-0000-0000-0000-000000000001',
        email: 'admin@test.com',
        first_name: 'Test',
        last_name: 'Admin',
        full_name: 'Test Admin',
        password_hash: passwordHash,
        role_id: adminRoleId,
        user_type: 'admin',
        account_status: 'Active',
        auth_provider: 'email_password'
      },
      {
        id: '99999999-0000-0000-0000-000000000002',
        email: 'student.a@test.com',
        first_name: 'Student',
        last_name: 'A',
        full_name: 'Student A',
        password_hash: passwordHash,
        role_id: studentRoleId,
        user_type: 'student',
        student_code: 'STU-A-1',
        account_status: 'Active',
        auth_provider: 'email_password'
      },
      {
        id: '99999999-0000-0000-0000-000000000003',
        email: 'student.b@test.com',
        first_name: 'Student',
        last_name: 'B',
        full_name: 'Student B',
        password_hash: passwordHash,
        role_id: studentRoleId,
        user_type: 'student',
        student_code: 'STU-B-1',
        account_status: 'Active',
        auth_provider: 'email_password'
      }
    ];

    for (const user of testUsers) {
      const exists = await DB('users').where({ email: user.email }).first();
      if (exists) {
        await DB('users').where({ email: user.email }).update(user);
        console.log(`Updated user: ${user.email}`);
      } else {
        await DB('users').insert(user);
        console.log(`Created user: ${user.email}`);
      }
    }

    const testStudents = [
      {
        id: 999991,
        student_id: 'STU-A-1',
        first_name: 'Student',
        last_name: 'A',
        email: 'student.a@test.com',
        account_status: true,
        risk_level: 'low'
      },
      {
        id: 999992,
        student_id: 'STU-B-1',
        first_name: 'Student',
        last_name: 'B',
        email: 'student.b@test.com',
        account_status: true,
        risk_level: 'high'
      }
    ];

    for (const student of testStudents) {
      const exists = await DB('students').where({ student_id: student.student_id }).first();
      if (exists) {
        await DB('students').where({ student_id: student.student_id }).update(student);
        console.log(`Updated student record: ${student.student_id}`);
      } else {
        await DB('students').insert(student);
        console.log(`Created student record: ${student.student_id}`);
      }
    }

    console.log('Test users and records setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

setupTestUsers();
