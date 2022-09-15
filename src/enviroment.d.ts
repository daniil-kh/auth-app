import { Dialect } from 'sequelize';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_DIALECT: Dialect;
      DB_HOST: string;
      DB_PORT: number;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      MINIO_ROOT_USER: string;
      MINIO_ROOT_PASSWORD: string;
      MONGO_INITDB_ROOT_USERNAME: string;
      MONGO_INITDB_ROOT_PASSWORD: string;
      MONGO_INITDB_DATABASE: string;
      MONGO_HOST: string;
      MONGO_PORT: string;
    }
  }
}
