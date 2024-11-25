import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  about: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  username: string;
}
