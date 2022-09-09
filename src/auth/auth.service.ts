import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === password) {
      return user;
    }

    return null;
  }
}
