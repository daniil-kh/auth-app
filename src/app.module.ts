import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.model';
import { UsersModule } from './users/users.module';
import { FilesModule } from './user-files/user-files.module';
import { UserFile } from './user-files/infrastructure/repositories/user-file.repository';
// import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, UserFile],
      autoLoadModels: true,
    }),
    // MongooseModule.forRoot(
    //   `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:` +
    //     `${process.env.MONGO_INITDB_ROOT_PASSWORD}@` +
    //     `${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/` +
    //     `${process.env.MONGO_INITDB_DATABASE}`,
    // ),
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
