import { Table, Column, Model, NotEmpty } from 'sequelize-typescript';
import { UserDto } from './dto/user.dto';

@Table
export class User extends Model<User, UserDto> {
  @NotEmpty
  @Column({ unique: true })
  email: string;

  @NotEmpty
  @Column
  password: string;
}
