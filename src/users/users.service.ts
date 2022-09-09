import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserDto } from './dto/user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepo: typeof User) {}

  public findAll(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  public findOne(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  public createUser(dto: UserDto): Promise<User> {
    return this.userRepo.create(dto);
  }
}
