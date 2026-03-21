import DB from '@/database';
import SopAssistantService from '@/services/sopAssistant.service';

const testImport = async () => {
    const service = new SopAssistantService();
    console.log('--- Testing SOP Import ---');

    const mockSOPs = [
        {
            studentName: 'Test Student 1',
            country: 'USA',
            university: 'Harvard',
            reviewStatus: 'Draft'
        },
        {
            studentName: 'Test Student 2',
            country: 'UK',
            university: 'Oxford',
            reviewStatus: 'Submitted'
        }
    ];

    const count = await service.importSOPs(mockSOPs);
    console.log(`Imported ${count} SOPs`);

    // Verify
    const sops = await service.getSOPs({ search: 'Test Student' });
    console.log('Imported SOPs:', JSON.stringify(sops, null, 2));

    if (sops.length === 2) {
        console.log('SUCCESS: SOPs imported and verified.');
    } else {
        console.log('FAILURE: SOPs count mismatch.');
    }

    // Clean up
    await DB('sops').where('student_name', 'like', 'Test Student%').del();
    console.log('Cleaned up test data.');

    process.exit(0);
};

testImport().catch(err => {
    console.error(err);
    process.exit(1);
});
