import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { UserFileCreationAttributes } from '../repositories-interfaces';

@Table({ tableName: 'userfiles' })
export class UserFile extends Model<UserFile, UserFileCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  url: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
}
