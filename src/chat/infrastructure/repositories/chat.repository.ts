import { Table, Column, Model, NotEmpty, DataType } from 'sequelize-typescript';
import { ChatEntity } from '../entities';

@Table
export class Chat extends Model<Chat, ChatEntity> {
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  from: string;

  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  to: string;

  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;
}
