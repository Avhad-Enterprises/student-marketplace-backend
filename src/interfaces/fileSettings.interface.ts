export interface FileSettings {
    id?: number;
    
    // Storage Configuration
    storage_provider: string;
    storage_region: string;
    max_storage_limit_gb: number;
    file_retention_period_days: number;
    enable_auto_cleanup: boolean;
    
    // Upload Rules
    allowed_file_types: string; // JSON string array
    max_file_size_mb: number;
    duplicate_file_handling: string;
    image_upload_limit_mb: number;
    video_upload_limit_mb: number;
    document_upload_limit_mb: number;
    
    // Asset Optimization
    enable_image_compression: boolean;
    enable_thumbnail_generation: boolean;
    enable_document_preview: boolean;
    enable_virus_scan: boolean;
    enable_file_encryption: boolean;
    
    // Access & Security
    default_file_visibility: string;
    temp_link_expiry_hours: number;
    enable_role_based_access: boolean;
    enable_temp_download_links: boolean;
    
    // Media Management
    enable_folder_structure: boolean;
    enable_asset_tagging: boolean;
    enable_file_versioning: boolean;
    enable_archive_old_assets: boolean;

    created_at?: Date;
    updated_at?: Date;
}
