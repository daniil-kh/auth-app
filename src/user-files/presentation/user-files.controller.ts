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
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserFilesService } from '../application';

@Injectable()
@Controller('files')
export class UserFilesController {
  private logger: Logger = new Logger(UserFilesController.name);

  constructor(
    @Inject(UserFilesService)
    private readonly userFilesService: UserFilesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') token: string,
  ) {
    return this.userFilesService.upload(file, token);
  }

  @Delete(':key')
  public delete(
    @Param('key') key: string,
    @Headers('Authorization') token: string,
  ) {
    return this.userFilesService.deleteByName(key, token);
  }

  @Get(':key')
  public get(
    @Param('key') key: string,
    @Headers('Authorization') token: string,
  ) {
    return this.userFilesService.getByName(key, token);
  }
}
