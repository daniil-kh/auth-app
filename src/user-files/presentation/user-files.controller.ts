import {
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioFileService } from '../application';

@Injectable()
@Controller('files')
export class UserFilesController {
  private logger: Logger = new Logger(UserFilesController.name);

  constructor(
    @Inject(MinioFileService)
    private readonly userFilesService: MinioFileService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.userFilesService.upload(file);
  }

  @Delete(':key')
  public delete(@Param('key') key: string) {
    return this.userFilesService.delete(key);
  }

  @Get(':key')
  public get(@Param('key') key: string) {
    return this.userFilesService.get(key);
  }
}
