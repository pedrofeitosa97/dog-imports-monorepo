import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { extname } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private client: S3Client | null = null;
  private bucket: string | null = null;
  private region: string | null = null;

  constructor(private config: ConfigService) {
    const accessKeyId     = config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = config.get<string>('AWS_SECRET_ACCESS_KEY');
    this.region           = config.get<string>('AWS_REGION') ?? null;
    this.bucket           = config.get<string>('AWS_S3_BUCKET') ?? null;

    if (accessKeyId && secretAccessKey && this.region && this.bucket) {
      this.client = new S3Client({
        region: this.region,
        credentials: { accessKeyId, secretAccessKey },
      });
    }
  }

  isConfigured(): boolean {
    return !!(this.client && this.bucket);
  }

  async uploadBuffer(
    buffer: Buffer,
    originalName: string,
    mimetype: string,
    folder = 'products',
  ): Promise<string> {
    if (!this.client || !this.bucket) {
      throw new Error('S3 não configurado. Defina as variáveis AWS_* no ambiente.');
    }

    const ext  = extname(originalName) || '.jpg';
    const key  = `${folder}/${randomUUID()}${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket:      this.bucket,
        Key:         key,
        Body:        buffer,
        ContentType: mimetype,
        // Para acesso público via URL direta:
        // CacheControl: 'max-age=31536000',
      }),
    );

    // URL pública: https://<bucket>.s3.<region>.amazonaws.com/<key>
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async deleteByUrl(url: string): Promise<void> {
    if (!this.client || !this.bucket) return;

    // Extrai a key a partir da URL pública
    const key = url.split('.amazonaws.com/')[1];
    if (!key) return;

    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}
