import DB from '@/database';
import SopAssistantService from '@/services/sopAssistant.service';

const testSettings = async () => {
    const service = new SopAssistantService();
    console.log('--- Testing SOP Assistant Settings ---');

    // 1. Get Initial Settings (Should have defaults from migration)
    const initialSettings = await service.getSettings();
    console.log('Initial Settings:', JSON.stringify(initialSettings, null, 2));

    // 2. Update Settings
    console.log('Updating settings...');
    await service.updateSettings({
        temperature: 0.8,
        model_version: 'gpt-4o-latest'
    });

    // 3. Verify Update
    const updatedSettings = await service.getSettings();
    console.log('Updated Settings:', JSON.stringify(updatedSettings, null, 2));

    if (updatedSettings.temperature === 0.8 && updatedSettings.model_version === 'gpt-4o-latest') {
        console.log('SUCCESS: Settings updated and verified.');
    } else {
        console.log('FAILURE: Settings mismatch.');
    }

    process.exit(0);
};

testSettings().catch(err => {
    console.error(err);
    process.exit(1);
});
