import DB from '@/database';
import SopAssistantService from '@/services/sopAssistant.service';

const testSearch = async () => {
    const service = new SopAssistantService();
    console.log('--- Testing Search ---');

    // Test 1: Empty Search (Should return all)
    const allResults = await service.getSOPs({});
    console.log(`Total records: ${allResults.length}`);

    // Test 2: Search by Student (Partial match)
    if (allResults.length > 0) {
        const firstStudent = allResults[0].studentName;
        const partialName = firstStudent.substring(0, 3);
        console.log(`Searching for: "${partialName}" (Partial of "${firstStudent}")`);
        const searchResults = await service.getSOPs({ search: partialName });
        console.log(`Found ${searchResults.length} matches.`);
        searchResults.forEach(s => console.log(`- ${s.studentName}`));
    } else {
        console.log('No records found to test search with.');
    }

    process.exit(0);
};

testSearch().catch(err => {
    console.error(err);
    process.exit(1);
});
