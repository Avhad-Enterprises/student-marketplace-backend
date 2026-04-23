import 'dotenv/config';
import DB from '../database';
import { MinioService } from '../services/minio.service';
import { DocumentService } from '../services/documents.service';
import { logger } from '../utils/logger';

async function verifyDocumentAPI() {
  console.log('--- Verifying Document API Logic ---');
  
  const minioService = new MinioService();
  const documentService = new DocumentService();
  
  try {
    // 1. Get a student for testing
    const student = await DB('students').first();
    if (!student) {
      console.error('No students found in database. Please run seed-data first.');
      process.exit(1);
    }
    console.log(`Using Student: ${student.first_name} ${student.last_name} (ID: ${student.id})`);

    // 2. Simulate File Upload
    console.log('\n2. Simulating File Upload...');
    const dummyFile = {
      originalname: 'test-document.pdf',
      mimetype: 'application/pdf',
      buffer: Buffer.from('dummy content'),
      size: 13,
    };
    
    const studentName = `${student.first_name}_${student.last_name}`;
    const objectName = await minioService.uploadFile(studentName, dummyFile);
    console.log('Uploaded to Minio:', objectName);

    // 3. Create Document Record
    console.log('\n3. Creating Document Record in DB...');
    const docData = {
      studentDbId: student.id,
      name: dummyFile.originalname,
      category: 'Verification Test',
      status: 'active',
      file_type: dummyFile.mimetype,
      file_size: dummyFile.size,
      uploaded_by: 'QA_Tester',
      file_url: objectName,
    };
    
    const docRecord = await documentService.create(docData);
    console.log('DB Record Created:', docRecord.id);

    // 4. Fetch and Generate URL
    console.log('\n4. Fetching Document and Generating URL...');
    const fetchedDoc = await documentService.findById(docRecord.id);
    if (!fetchedDoc) throw new Error('Failed to fetch document record');
    
    const url = await minioService.getPresignedUrl(fetchedDoc.file_url);
    console.log('Success! Presigned URL generated:', url);
    
    console.log('\n--- VERIFICATION SUCCESSFUL ---');
    
    // Optional: Cleanup
    // await minioService.deleteFile(objectName);
    // await documentService.delete(docRecord.id);
    // console.log('Cleaned up test data.');

  } catch (error: any) {
    console.error('\nVerification Failed:', error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    await DB.destroy();
  }
}

verifyDocumentAPI();
