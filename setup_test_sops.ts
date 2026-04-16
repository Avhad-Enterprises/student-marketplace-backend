import DB from './src/database';

async function setupTestSOPs() {
  try {
    const testSOPs = [
      {
        id: 777771,
        student_id: 'STU-A-1',
        student_name: 'Student A',
        country: 'Canada',
        university: 'University of Toronto',
        status: 'active',
        review_status: 'approved',
        ai_confidence_score: '0.95'
      },
      {
        id: 777772,
        student_id: 'STU-B-1',
        student_name: 'Student B',
        country: 'USA',
        university: 'Stanford',
        status: 'inactive',
        review_status: 'pending',
        ai_confidence_score: '0.88'
      }
    ];

    for (const sop of testSOPs) {
      const exists = await DB('sops').where({ id: sop.id }).first();
      if (exists) {
        await DB('sops').where({ id: sop.id }).update(sop);
        console.log(`Updated SOP: ${sop.id}`);
      } else {
        await DB('sops').insert(sop);
        console.log(`Created SOP: ${sop.id}`);
      }
    }

    console.log('Test SOPs setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during SOP setup:', error);
    process.exit(1);
  }
}

setupTestSOPs();
