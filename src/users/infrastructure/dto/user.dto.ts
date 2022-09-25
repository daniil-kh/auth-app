export class UserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly refreshToken: string;
}

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  refreshToken: string;
}

export class UpdateUserDto {
  refreshToken: string;
}
