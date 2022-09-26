import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from 'src/users/application/users.service';
import { ChatEntity } from '../infrastructure/entities';
import { Chat } from '../infrastructure/repositories';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat) private chatRepo: typeof Chat,
    private userRepo: UsersService,
  ) {}

  public async checkUserId(to: string): Promise<void> {
    if (!(await this.userRepo.findOneById(to))) {
      throw new HttpException(
        'Adressee does not exist in the system',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async createMessage(dto: ChatEntity): Promise<Chat> {
    const { to } = dto;
    await this.checkUserId(to);
    return this.chatRepo.create(dto);
  }

  public getMessages(): Promise<Chat[]> {
    return this.chatRepo.findAll();
  }
}
