/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const table = 'file_settings';
    
    // Create table if it doesn't exist
    const exists = await knex.schema.hasTable(table);
    if (!exists) {
        await knex.schema.createTable(table, t => {
            t.increments('id').primary();
            
            // Storage Configuration
            t.string('storage_provider', 100).defaultTo('AWS S3');
            t.string('storage_region', 100).defaultTo('US East (N. Virginia)');
            t.integer('max_storage_limit_gb').defaultTo(100);
            t.integer('file_retention_period_days').defaultTo(365);
            t.boolean('enable_auto_cleanup').defaultTo(true);
            
            // Upload Rules
            t.text('allowed_file_types').defaultTo('["PDF", "DOC", "DOCX", "JPG", "JPEG", "PNG", "GIF", "MP4", "MOV", "ZIP"]'); // JSON string array
            t.integer('max_file_size_mb').defaultTo(10);
            t.string('duplicate_file_handling', 50).defaultTo('Rename (add suffix)');
            t.integer('image_upload_limit_mb').defaultTo(50);
            t.integer('video_upload_limit_mb').defaultTo(500);
            t.integer('document_upload_limit_mb').defaultTo(20);
            
            // Asset Optimization
            t.boolean('enable_image_compression').defaultTo(true);
            t.boolean('enable_thumbnail_generation').defaultTo(true);
            t.boolean('enable_document_preview').defaultTo(true);
            t.boolean('enable_virus_scan').defaultTo(true);
            t.boolean('enable_file_encryption').defaultTo(false);
            
            // Access & Security
            t.string('default_file_visibility', 50).defaultTo('Private (authentication required)');
            t.integer('temp_link_expiry_hours').defaultTo(24);
            t.boolean('enable_role_based_access').defaultTo(true);
            t.boolean('enable_temp_download_links').defaultTo(true);
            
            // Media Management
            t.boolean('enable_folder_structure').defaultTo(true);
            t.boolean('enable_asset_tagging').defaultTo(true);
            t.boolean('enable_file_versioning').defaultTo(false);
            t.boolean('enable_archive_old_assets').defaultTo(true);
            
            t.timestamps(true, true);
        });
    }

    // Ensure initial record exists
    const hasRecord = await knex(table).where('id', 1).first();
    if (!hasRecord) {
        await knex(table).insert({ id: 1 });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('file_settings');
};
