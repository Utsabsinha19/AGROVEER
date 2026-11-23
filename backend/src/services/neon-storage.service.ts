import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

export class NeonStorageService {
  private static client: S3Client | null = null;
  private static readonly defaultBucket = 'assets';

  public static getClient(): S3Client {
    if (!this.client) {
      this.client = new S3Client({
        endpoint: process.env.AWS_ENDPOINT_URL_S3,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
        region: process.env.AWS_REGION || 'ap-southeast-1',
        forcePathStyle: true,
      });
    }
    return this.client;
  }

  public static async uploadFile(
    key: string,
    body: Buffer | string,
    contentType: string = 'application/octet-stream',
    bucket: string = this.defaultBucket
  ) {
    const s3 = this.getClient();
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    await s3.send(command);
    return {
      bucket,
      key,
      url: `${process.env.AWS_ENDPOINT_URL_S3}/${bucket}/${key}`,
    };
  }

  public static async listFiles(prefix?: string, bucket: string = this.defaultBucket) {
    const s3 = this.getClient();
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });
    const res = await s3.send(command);
    return res.Contents || [];
  }

  public static async getDownloadUrl(key: string, expiresInSec: number = 3600, bucket: string = this.defaultBucket) {
    const s3 = this.getClient();
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return getSignedUrl(s3, command, { expiresIn: expiresInSec });
  }
}

