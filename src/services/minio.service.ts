import * as Minio from 'minio';
import { logger } from '@/utils/logger';

export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || '',
      port: parseInt(process.env.MINIO_PORT || '443'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || '',
      secretKey: process.env.MINIO_SECRET_KEY || '',
    });
    this.bucketName = process.env.MINIO_BUCKET_NAME || 'ism-admin';
    this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        logger.info(`Bucket ${this.bucketName} created successfully.`);
      }
    } catch (err: any) {
      logger.error(`Error ensuring bucket exists: ${err.message}`);
    }
  }

  /**
   * Uploads a file to Minio
   * @param studentName Folder name (student name)
   * @param file Multer file object
   * @returns Object name (path in bucket)
   */
  public async uploadFile(studentName: string, file: any): Promise<string> {
    const timestamp = Date.now();
    const sanitizedFileName = file.originalname.replace(/\s+/g, '_');
    const fileName = `${timestamp}-${sanitizedFileName}`;
    const objectName = `${studentName.replace(/\s+/g, '_')}/${fileName}`;

    await this.minioClient.putObject(
      this.bucketName,
      objectName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    return objectName;
  }

  /**
   * Generates a presigned URL for file access
   * @param objectName Object path in bucket
   * @returns Presigned URL string
   */
  public async getPresignedUrl(objectName: string): Promise<string> {
    try {
      // Generate a presigned URL valid for 1 hour (3600 seconds)
      return await this.minioClient.presignedGetObject(this.bucketName, objectName, 3600);
    } catch (err: any) {
      logger.error(`Error generating presigned URL: ${err.message}`);
      throw err;
    }
  }

  /**
   * Deletes an object from Minio
   * @param objectName Object path in bucket
   */
  public async deleteFile(objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, objectName);
    } catch (err: any) {
      logger.error(`Error deleting file from Minio: ${err.message}`);
      throw err;
    }
  }
}
