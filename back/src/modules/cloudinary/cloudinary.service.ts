import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  }

  isConfigured(): boolean {
    return !!(
      this.config.get('CLOUDINARY_CLOUD_NAME') &&
      this.config.get('CLOUDINARY_API_KEY') &&
      this.config.get('CLOUDINARY_API_SECRET')
    );
  }

  uploadBuffer(buffer: Buffer, folder = 'dog-imports/products'): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error('Upload falhou'));
          resolve(result.secure_url);
        },
      );
      Readable.from(buffer).pipe(stream);
    });
  }
}
