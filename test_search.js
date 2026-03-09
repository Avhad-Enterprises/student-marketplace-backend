const DB = require('./src/database').default;
const SopAssistantService = require('./src/services/sopAssistant.service').default;

async function testSearch() {
    const service = new SopAssistantService();
    console.log('Testing search for "John"...');
    try {
        const results = await service.getSOPs({ search: 'John' });
        console.log('Results:', JSON.stringify(results, null, 2));
    } catch (error) {
        console.error('Error during search test:', error);
    }
    process.exit(0);
}

testSearch();
