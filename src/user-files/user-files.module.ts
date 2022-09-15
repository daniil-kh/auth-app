import { Module } from '@nestjs/common';
import { MinioFileService } from './application/minio-file.service';
import { UserFilesController } from './presentation';

@Module({
  controllers: [UserFilesController],
  providers: [MinioFileService],
  exports: [MinioFileService],
})
export class FilesModule {}
