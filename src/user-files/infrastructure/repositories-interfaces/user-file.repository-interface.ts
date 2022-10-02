import { QueryOptionsWithType, QueryTypes } from 'sequelize';

export interface UserFileCreationAttributes {
  name: string;
  url: string;
  userId: string;
}

export interface UserFileDto {
  id: string;
  name: string;
  url: string;
  userId: string;
}

export type TypedQueryParams<T extends QueryTypes = QueryTypes.SELECT> = Omit<
  QueryOptionsWithType<T>,
  'type'
>;
