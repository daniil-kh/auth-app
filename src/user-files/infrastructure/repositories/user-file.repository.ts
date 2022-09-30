import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { UserFile } from '../entities';
import { UserFileCreationAttributes } from '../repositories-interfaces';

@Injectable()
export class UserFileRepository {
  private readonly logger = new Logger(UserFileRepository.name);

  constructor(
    @InjectModel(UserFile) private readonly userFileRepo: typeof UserFile,
  ) {}

  async findAll(userId: string): Promise<UserFile[]> {
    try {
      const result = await this.userFileRepo.sequelize.query<UserFile>(
        'select * from userfiles where userId = $userId',
        { type: QueryTypes.SELECT, bind: { userId } },
      );

      return result;
    } catch (error) {
      this.logger.error(`findAll: ${JSON.stringify(error, null, 2)}`);
      return [];
    }
  }

  async findOneById(id: string, userId: string): Promise<UserFile | null> {
    try {
      const result = await this.userFileRepo.sequelize.query<UserFile>(
        'select * from userfiles where id = $id and userId = $userId',
        { type: QueryTypes.SELECT, bind: { id, userId } },
      );

      return result[0] ?? null;
    } catch (error) {
      this.logger.error(`findOneById: ${JSON.stringify(error, null, 2)}`);
      return null;
    }
  }

  async findOneByName(name: string, userId: string): Promise<UserFile | null> {
    try {
      const result = await this.userFileRepo.sequelize.query<UserFile>(
        'select * from userfiles where name = $name and userId = $userId',
        { type: QueryTypes.SELECT, bind: { name, userId } },
      );

      return result[0] ?? null;
    } catch (error) {
      this.logger.error(`findOneByName: ${JSON.stringify(error, null, 2)}`);
      return null;
    }
  }

  async deleteById(id: string, userId: string): Promise<void> {
    try {
      await this.userFileRepo.sequelize.query(
        'delete from userfiles where id = $id and userId = $userId',
        { type: QueryTypes.DELETE, bind: { id, userId } },
      );
    } catch (error) {
      this.logger.error(`deleteById: ${JSON.stringify(error, null, 2)}`);
    }
  }

  async deleteByName(name: string, userId: string): Promise<void> {
    try {
      await this.userFileRepo.sequelize.query(
        'delete from userfiles where name = $name and userId = $userId',
        { type: QueryTypes.DELETE, bind: { name, userId } },
      );
    } catch (error) {
      this.logger.error(`deleteByName: ${JSON.stringify(error, null, 2)}`);
    }
  }

  async updateById(id: string, dto: UserFileCreationAttributes) {
    try {
      const [_, metadata] = await this.userFileRepo.sequelize.query(
        'update userfiles set name = $name, url = $url where id = $id and userId = $userId',
        {
          type: QueryTypes.UPDATE,
          bind: { id, ...dto },
        },
      );

      return metadata;
    } catch (error) {
      this.logger.error(`updateById: ${JSON.stringify(error, null, 2)}`);
      return null;
    }
  }

  async updateByName(name: string, dto: UserFileCreationAttributes) {
    try {
      const [_, metadata] = await this.userFileRepo.sequelize.query(
        'update userfiles set name = $name, url = $url where name = $name and userId = $userId',
        {
          type: QueryTypes.UPDATE,
          bind: { name, ...dto },
        },
      );

      return metadata;
    } catch (error) {
      this.logger.error(`updateByName: ${JSON.stringify(error, null, 2)}`);
      return null;
    }
  }

  async create(dto: UserFileCreationAttributes) {
    try {
      const result = await this.userFileRepo.sequelize.query(
        `insert into userfiles (name, url, userid) values (:name, :url, :userId)`,
        {
          type: QueryTypes.INSERT,
          replacements: {
            ...dto,
          },
        },
      );

      return result;
    } catch (error) {
      this.logger.error(`create: ${JSON.stringify(error, null, 2)}`);
      return null;
    }
  }
}
