import DB from '@/database';
import { FileSettings } from '@/interfaces/fileSettings.interface';

class FileSettingsService {
    public async getSettings(): Promise<FileSettings> {
        const settings: any = await DB('file_settings').first();
        if (!settings) {
            return {
                storage_provider: 'AWS S3',
                storage_region: 'US East (N. Virginia)',
                max_storage_limit_gb: 100,
                file_retention_period_days: 365,
                enable_auto_cleanup: true,
                allowed_file_types: '["PDF", "DOC", "DOCX", "JPG", "JPEG", "PNG", "GIF", "MP4", "MOV", "ZIP"]',
                max_file_size_mb: 10,
                duplicate_file_handling: 'Rename (add suffix)',
                image_upload_limit_mb: 50,
                video_upload_limit_mb: 500,
                document_upload_limit_mb: 20,
                enable_image_compression: true,
                enable_thumbnail_generation: true,
                enable_document_preview: true,
                enable_virus_scan: true,
                enable_file_encryption: false,
                default_file_visibility: 'Private (authentication required)',
                temp_link_expiry_hours: 24,
                enable_role_based_access: true,
                enable_temp_download_links: true,
                enable_folder_structure: true,
                enable_asset_tagging: true,
                enable_file_versioning: false,
                enable_archive_old_assets: true,
            };
        }
        return settings;
    }

    public async updateSettings(settingsData: Partial<FileSettings>): Promise<FileSettings> {
        const { id, created_at, updated_at, ...cleanData } = settingsData as any;
        
        const existing = await DB('file_settings').first();
        const dataToSave = {
            ...cleanData,
            updated_at: new Date()
        };

        if (existing) {
            await DB('file_settings').where({ id: existing.id }).update(dataToSave);
        } else {
            await DB('file_settings').insert(dataToSave);
        }

        return this.getSettings();
    }
}

export default FileSettingsService;
