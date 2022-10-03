import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/application/accessToken.strategy';
import { MinioFileService } from '../domain';
import { UserFileRepository } from '../infrastructure/repositories';
import { isError } from '@core/utils';

@Injectable()
export class UserFilesService {
  constructor(
    private readonly minioFileService: MinioFileService,
    private readonly userFilesRepository: UserFileRepository,
    private readonly jwtService: JwtService,
  ) {}

  private getUserIdFromToken(token: string) {
    const tokenPart = token.split(' ')[1];
    const decodedToken = this.jwtService.decode(tokenPart) as JwtPayload;
    return decodedToken?.sub ?? '';
  }

  async getByName(name: string, token: string) {
    const result = await this.userFilesRepository.findOneByName(
      name,
      this.getUserIdFromToken(token),
    );

    if (isError(result)) {
      throw new NotFoundException(result.data, 'File not found');
    }

    if (result.data.length <= 0) {
      throw new NotFoundException('File not found');
    }

    return result.data[0];
  }

  async deleteById(id: string, token: string) {
    const getFileResult = await this.userFilesRepository.findOneById(
      id,
      this.getUserIdFromToken(token),
    );

    if (isError(getFileResult)) {
      throw new NotFoundException(getFileResult.data, 'File not found');
    }

    if (getFileResult.data.length <= 0) {
      throw new NotFoundException('File not found');
    }

    const fileToDelete = getFileResult.data[0];

    await this.minioFileService.delete(fileToDelete.name);

    const deleteFileResult = await this.userFilesRepository.deleteById(
      id,
      this.getUserIdFromToken(token),
    );

    if (isError(deleteFileResult)) {
      throw new BadRequestException(
        deleteFileResult.data,
        'Cannot delete file',
      );
    }

    return deleteFileResult.data;
  }

  async deleteByName(name: string, token: string) {
    const getFileResult = await this.userFilesRepository.findOneByName(
      name,
      this.getUserIdFromToken(token),
    );

    if (isError(getFileResult)) {
      throw new NotFoundException(getFileResult.data, 'File not found');
    }

    if (getFileResult.data.length <= 0) {
      throw new NotFoundException('File not found');
    }

    const fileToDelete = getFileResult.data[0];

    await this.minioFileService.delete(fileToDelete.name);

    const deleteFileResult = await this.userFilesRepository.deleteByName(
      name,
      this.getUserIdFromToken(token),
    );

    if (isError(deleteFileResult)) {
      throw new BadRequestException(
        deleteFileResult.data,
        'Cannot delete file',
      );
    }

    return deleteFileResult.data;
  }

  async upload(file: Express.Multer.File, token: string) {
    const { fileName, fileUrl } = await this.minioFileService.upload(file);
    const result = await this.userFilesRepository.create({
      name: fileName,
      url: fileUrl,
      userId: this.getUserIdFromToken(token),
    });

    if (isError(result)) {
      await this.minioFileService.delete(fileName);
      throw new BadRequestException(result.data, 'Cannot upload file');
    }

    if (result.data.length <= 0) {
      await this.minioFileService.delete(fileName);
      throw new BadRequestException('Cannot upload file');
    }

    return result.data[0];
  }
}
