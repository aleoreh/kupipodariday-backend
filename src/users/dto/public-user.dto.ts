import { Exclude } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { IUser } from '../users.interface';

export class PublicUserDto extends CreateUserDto implements IUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  about: string;
  avatar: string;
  username: string;

  @Exclude()
  password: string;

  @Exclude()
  email: string;

  constructor(user: IUser) {
    super();
    Object.assign(this, user);
  }
}
