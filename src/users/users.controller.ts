import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  @Post()
  async create(@Body() dto: UserDto) {
    return this.usersService.createUser(dto);
  }
}
