import DB from './src/database';

async function setupTestSops() {
  try {
    const testSops = [
      {
        id: 999991,
        student_id: 'STUD-A-1',
        student_name: 'Student A',
        country: 'Canada',
        university: 'UBC',
        status: 'pending',
        review_status: 'pending',
        ai_confidence_score: 85.5,
        created_at: new Date()
      },
      {
        id: 999992,
        student_id: 'STUD-B-1',
        student_name: 'Student B',
        country: 'UK',
        university: 'Oxford',
        status: 'completed',
        review_status: 'approved',
        ai_confidence_score: 92.0,
        created_at: new Date()
      }
    ];

    for (const sop of testSops) {
      const exists = await DB('sops').where({ id: sop.id }).first();
      if (exists) {
        await DB('sops').where({ id: sop.id }).update(sop);
        console.log(`Updated SOP for student: ${sop.student_id}`);
      } else {
        await DB('sops').insert(sop);
        console.log(`Created SOP for student: ${sop.student_id}`);
      }
    }

    console.log('Test SOP Assistant data setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during SOP setup:', error);
    process.exit(1);
  }
}

setupTestSops();
