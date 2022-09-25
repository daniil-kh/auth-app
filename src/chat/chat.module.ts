import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway, ChatService } from './application';
import { Chat } from './infrastructure/repositories';
import { chatProviders } from './presentation';

@Module({
  imports: [SequelizeModule.forFeature([Chat]), UsersModule],
  providers: [ChatService, ChatGateway, ...chatProviders],
  controllers: [],
  exports: [ChatService],
})
export class ChatModule {}
