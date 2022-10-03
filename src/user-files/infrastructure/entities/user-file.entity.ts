import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { UserFileCreationAttributes } from '../repositories-interfaces';

@Table({ tableName: 'userfiles', timestamps: false })
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
    type: DataType.STRING,
    allowNull: false,
  })
  userid: string;
}
