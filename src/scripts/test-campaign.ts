import db from '../database';
import { CampaignsService } from '../communications/services/campaigns.service';
import { AudienceSegmentsService } from '../communications/services/audience-segments.service';

const testCampaign = async () => {
  try {
    const campaignsService = new CampaignsService();
    const segmentsService = new AudienceSegmentsService();

    console.log('Ensuring test student exists...');
    const email = 'swapnilsonawane2237@gmail.com';
    let student = await db('students').where('email', email).first();
    
    if (!student) {
      const [newStudent] = await db('students').insert({
        first_name: 'Swapnil',
        last_name: 'Test',
        email: email,
        status: 'Lead',
        created_at: new Date()
      }).returning('*');
      student = newStudent;
      console.log('Created test student:', student.id);
    } else {
      console.log('Test student exists:', student.id);
    }

    console.log('Ensuring test segment exists...');
    let segment = await db('audience_segments').where('name', 'Test Segment SMTP').first();
    if (!segment) {
      segment = await segmentsService.createSegment(null, {
        name: 'Test Segment SMTP',
        match_type: 'ALL',
        rules_json: [],
        is_active: true
      });
      console.log('Created test segment:', segment.id);
      
      // Manually add the student to this segment
      await db('audience_segment_members').insert({
        segment_id: segment.id,
        student_db_id: student.id
      });
      console.log('Added student to segment');
    } else {
      console.log('Test segment exists:', segment.id);
      // Ensure student is in it
      const member = await db('audience_segment_members').where({ segment_id: segment.id, student_db_id: student.id }).first();
      if (!member) {
        await db('audience_segment_members').insert({ segment_id: segment.id, student_db_id: student.id });
      }
    }

    console.log('Creating test campaign...');
    const campaign = await campaignsService.createCampaign(null, {
      name: 'SMTP Integration Test ' + Date.now(),
      channel: 'email',
      subject: 'Test Campaign from {{name}}',
      content: '<p>Hello {{first_name}},</p><p>This is a test campaign testing the new dynamic asynchronous dispatch using SMTP.</p>',
      audience_rule: {
        source: 'segment',
        segment_id: segment.id
      }
    });

    console.log('Sending campaign', campaign.id);
    const result = await campaignsService.sendCampaign(null, campaign.id);
    console.log('Send result:', result);

    // Wait a bit for the async processing to finish
    await new Promise(resolve => setTimeout(resolve, 5000));

    const finalStats = await db('event_campaigns').where('id', campaign.id).first();
    console.log('Final stats:', {
       status: finalStats.status,
       sent: finalStats.sent_count,
       failed: finalStats.bounce_count
    });

    const logs = await db('campaign_recipients').where('campaign_id', campaign.id);
    console.log('Recipient logs:', logs.map((l: any) => ({ email: l.recipient_email, status: l.status, error: l.error_message })));

    process.exit(0);
  } catch (error) {
    console.error('Error during test:', error);
    process.exit(1);
  }
};

testCampaign();
