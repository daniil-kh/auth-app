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
    }
  }
}
