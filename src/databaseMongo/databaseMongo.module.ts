import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: 'mongodb://mongo_database:27017/chat_node',
      }),
    }),
  ],
})
export class DatabaseMongoModule {}
