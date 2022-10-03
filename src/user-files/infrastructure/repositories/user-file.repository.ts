import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { UserFile } from '../entities';
import {
  TypedQueryParams,
  UserFileCreationAttributes,
} from '../repositories-interfaces';
import { QueryResult, createQueryResult, QueryStatus } from '@core/utils';

@Injectable()
export class UserFileRepository {
  private readonly logger = new Logger(UserFileRepository.name);

  constructor(
    @InjectModel(UserFile) private readonly userFileRepo: typeof UserFile,
  ) {}

  private async query<T extends QueryTypes, RT = unknown>(
    queryString: string,
    params: TypedQueryParams<T>,
  ): Promise<QueryResult<RT[]>> {
    try {
      const result = (await this.userFileRepo.sequelize.query(queryString, {
        type: QueryTypes.RAW,
        ...params,
      })) as [RT[], unknown];
      return createQueryResult(QueryStatus.Ok, result[0]);
    } catch (error) {
      this.logger.error(`${JSON.stringify(error, null, 2)}`);
      return createQueryResult(QueryStatus.Error, error);
    }
  }

  async findAll(userId: string) {
    return this.query<QueryTypes.SELECT, UserFile>(
      'select * from userfiles where userid = :userId',
      { replacements: { userId } },
    );
  }

  async findOneById(id: string, userId: string) {
    return this.query<QueryTypes.SELECT, UserFile>(
      'select * from userfiles where id = :id and userid = :userId',
      { replacements: { id, userId } },
    );
  }

  async findOneByName(
    name: string,
    userId: string,
  ): Promise<QueryResult<UserFile[]>> {
    return this.query<QueryTypes.SELECT, UserFile>(
      'select * from userfiles where name = :name and userid = :userId',
      { replacements: { name, userId } },
    );
  }

  async deleteById(id: string, userId: string) {
    return this.query<QueryTypes.DELETE, never>(
      'delete from userfiles where id = :id and userid = :userId',
      {
        replacements: { id, userId },
      },
    );
  }

  async deleteByName(name: string, userId: string) {
    return this.query<QueryTypes.DELETE, never>(
      'delete from userfiles where name = :name and userid = :userId',
      {
        replacements: { name, userId },
      },
    );
  }

  async updateById(id: string, dto: UserFileCreationAttributes) {
    return this.query<QueryTypes.UPDATE, UserFile>(
      'update userfiles set name = :name, url = :url where id = :id and userid = :userId returning id, name, url, userid',
      {
        replacements: { id, ...dto },
      },
    );
  }

  async updateByName(name: string, dto: UserFileCreationAttributes) {
    return this.query<QueryTypes.UPDATE, UserFile>(
      'update userfiles set name = :name, url = :url where name = :name and userid = :userId returning id, name, url, userid',
      {
        replacements: { name, ...dto },
      },
    );
  }

  async create(dto: UserFileCreationAttributes) {
    return this.query<QueryTypes.INSERT, UserFile>(
      `insert into userfiles (name, url, userid) values (:name, :url, :userId) returning id, name, url, userid`,
      {
        replacements: {
          ...dto,
        },
      },
    );
  }
}
