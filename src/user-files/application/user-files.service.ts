import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/application/accessToken.strategy';
import { MinioFileService } from '../domain';
import { UserFileRepository } from '../infrastructure/repositories';

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

  getByName(name: string, token: string) {
    return this.userFilesRepository.findOneByName(
      name,
      this.getUserIdFromToken(token),
    );
  }

  async deleteById(id: string, token: string) {
    const fileToDelete = await this.userFilesRepository.findOneById(
      id,
      this.getUserIdFromToken(token),
    );

    if (fileToDelete === null) {
      return;
    }

    await this.minioFileService.delete(fileToDelete.name);

    return this.userFilesRepository.deleteById(
      id,
      this.getUserIdFromToken(token),
    );
  }

  async deleteByName(name: string, token: string) {
    const fileToDelete = await this.userFilesRepository.findOneByName(
      name,
      this.getUserIdFromToken(token),
    );

    if (fileToDelete === null) {
      return;
    }

    await this.minioFileService.delete(fileToDelete.name);

    return this.userFilesRepository.deleteByName(
      name,
      this.getUserIdFromToken(token),
    );
  }

  async upload(file: Express.Multer.File, token: string) {
    const { fileName, fileUrl } = await this.minioFileService.upload(file);
    const result = this.userFilesRepository.create({
      name: fileName,
      url: fileUrl,
      userId: this.getUserIdFromToken(token),
    });

    return result;
  }
}
