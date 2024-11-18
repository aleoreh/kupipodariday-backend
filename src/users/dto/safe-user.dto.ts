import { Exclude } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { IUser } from '../users.interface';

export class SafeUserDto extends CreateUserDto implements IUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  about: string;
  avatar: string;
  email: string;
  username: string;

  @Exclude()
  password: string;

  constructor(user: IUser) {
    super();
    Object.assign(this, user);
  }
}
