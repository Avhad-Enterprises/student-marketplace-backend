import DB from '../database';
import fs from 'fs';
import path from 'path';

// Disable SSL for local dev if needed
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const backupData = async () => {
    try {
        console.log('Starting backup of universities...');
        const universities = await DB('universities').select('*');
        const countries = await DB('countries').select('*');

        const backupDir = path.join(__dirname, '../../backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        // Universities Backup
        const uniPath = path.join(backupDir, `universities_backup_${timestamp}.json`);
        fs.writeFileSync(uniPath, JSON.stringify(universities, null, 2));
        console.log(`✅ Universities backed up to: ${uniPath} (${universities.length} records)`);

        // Countries Backup (since they are related)
        const countryPath = path.join(backupDir, `countries_backup_${timestamp}.json`);
        fs.writeFileSync(countryPath, JSON.stringify(countries, null, 2));
        console.log(`✅ Countries backed up to: ${countryPath} (${countries.length} records)`);

    } catch (error) {
        console.error('❌ Backup failed:', error);
    } finally {
        process.exit();
    }
};

backupData();
