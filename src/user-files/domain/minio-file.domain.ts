import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Readable } from 'stream';

@Injectable()
export class MinioFileService {
  private bucket = 'test-minio-bucket';
  private region = 'us-east-1';
  private minioUrl = 'http://minio:9000';
  private s3client: S3Client;
  private logger: Logger = new Logger(MinioFileService.name);
  constructor() {
    this.s3client = new S3Client({
      region: this.region,
      forcePathStyle: true,
      endpoint: this.minioUrl,
      credentials: {
        accessKeyId: process.env.MINIO_ROOT_USER,
        secretAccessKey: process.env.MINIO_ROOT_PASSWORD,
      },
    });
  }

  public async upload(file: Express.Multer.File) {
    const currTime = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(file.originalname)
      .update(currTime)
      .digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
    };
    const fileName = hashedFileName + extension;
    try {
      await this.s3client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: fileName,
          Body: file.buffer,
          Metadata: metaData,
        }),
      );

      return {
        fileUrl: `${this.minioUrl}/${this.bucket}/${fileName}`,
        fileName,
        extension,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new BadRequestException('Cannot upload file');
    }
  }

  public async delete(key: string) {
    try {
      return await this.s3client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new ConflictException('Cannot delete this file');
    }
  }

  public async get(key: string) {
    try {
      const data: GetObjectCommandOutput = await this.s3client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );

      if (data.Body instanceof Readable) {
        return new StreamableFile(data.Body);
      }

      return data.Body;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new NotFoundException('Such file is not exist');
    }
  }
}
