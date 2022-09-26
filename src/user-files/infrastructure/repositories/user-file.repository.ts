import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { UserFile } from '../entities';
import { UserFileCreationAttributes } from '../repositories-interfaces';

@Injectable()
export class UserFileRepository {
  constructor(
    @InjectModel(UserFile) private readonly userFileRepo: typeof UserFile,
  ) {}

  async findAll(userId: string): Promise<UserFile[]> {
    const result = await this.userFileRepo.sequelize.query<UserFile>(
      'select * from userfiles where userId = $userId',
      { type: QueryTypes.SELECT, bind: { userId } },
    );

    return result;
  }

  async findOneById(id: string, userId: string): Promise<UserFile | null> {
    const result = await this.userFileRepo.sequelize.query<UserFile>(
      'select * from userfiles where id = $id and userId = $userId',
      { type: QueryTypes.SELECT, bind: { id, userId } },
    );

    return result[0] ?? null;
  }

  async findOneByName(name: string, userId: string): Promise<UserFile | null> {
    const result = await this.userFileRepo.sequelize.query<UserFile>(
      'select * from userfiles where name = $name and userId = $userId',
      { type: QueryTypes.SELECT, bind: { name, userId } },
    );

    return result[0] ?? null;
  }

  async deleteById(id: string, userId: string): Promise<void> {
    await this.userFileRepo.sequelize.query(
      'delete from userfiles where id = $id and userId = $userId',
      { type: QueryTypes.DELETE, bind: { id, userId } },
    );
  }

  async deleteByName(name: string, userId: string): Promise<void> {
    await this.userFileRepo.sequelize.query(
      'delete from userfiles where name = $name and userId = $userId',
      { type: QueryTypes.DELETE, bind: { name, userId } },
    );
  }

  async updateById(id: string, dto: UserFileCreationAttributes) {
    const [_, metadata] = await this.userFileRepo.sequelize.query(
      'update userfiles set name = $name, url = $url where id = $id and userId = $userId',
      {
        type: QueryTypes.UPDATE,
        bind: { id, ...dto },
      },
    );

    return metadata;
  }

  async updateByName(name: string, dto: UserFileCreationAttributes) {
    const [_, metadata] = await this.userFileRepo.sequelize.query(
      'update userfiles set name = $name, url = $url where name = $name and userId = $userId',
      {
        type: QueryTypes.UPDATE,
        bind: { name, ...dto },
      },
    );

    return metadata;
  }

  async create(dto: UserFileCreationAttributes) {
    const result = await this.userFileRepo.sequelize.query(
      'insert into userfiles (name, url, userId) values ($name, $url, $userId)',
      { type: QueryTypes.INSERT, bind: { ...dto } },
    );

    return result;
  }
}
