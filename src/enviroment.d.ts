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
      MINIO_BUCKET: string;
      MINIO_REGION: string;
      MINIO_PRIVATE_URL: string;
      MINIO_PUBLICS_URL: string;
      MONGO_INITDB_ROOT_USERNAME: string;
      MONGO_INITDB_ROOT_PASSWORD: string;
      MONGO_INITDB_DATABASE: string;
      MONGO_HOST: string;
      MONGO_PORT: string;
    }
  }
}
