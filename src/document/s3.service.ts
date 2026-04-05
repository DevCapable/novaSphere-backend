import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { generateRandomNumber } from '@app/core/util/functions';
import { CustomInternalServerException } from '@app/core/error';

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const s3_region = this.configService.getOrThrow('S3_REGION');
    this.bucketName = this.configService.get('S3_BUCKET_NAME');

    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file, folder: string) {
    try {
      if (!folder.endsWith('/')) {
        folder = `${folder}/`;
      }

      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      const baseName = file.originalname
        .slice(0, -(fileExtension.length + 1))
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();
      const fileName = `${baseName}-${generateRandomNumber(10)}.${fileExtension}`;
      const key = `${folder}${fileName}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
        },
        // ACL: 'public-read',
      });
      await this.client.send(command);
      return {
        name: fileName,
        filePath: this.getFileUrl(key).url,
        awsKey: fileName,
        mimeType: file.mimetype,
        size: file.size,
      };
    } catch (error: any) {
      throw new CustomInternalServerException(error);
    }
  }

  getFileUrl(key: string) {
    return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
  }

  async getPresignedSignedUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24, // 24 hours
      });

      return { url };
    } catch (error: any) {
      throw new CustomInternalServerException(error);
    }
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: `files/${key}`,
      });

      await this.client.send(command);

      return { message: 'File deleted successfully' };
    } catch (error: any) {
      throw new CustomInternalServerException(error);
    }
  }
}
