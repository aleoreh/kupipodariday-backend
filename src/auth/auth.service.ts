import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7 days' }),
    };
  }

  async validatePassword(username: string, password: string) {
    return this.usersService
      .findOneForAuthByUsername(username)
      .then((user) => {
        return bcrypt
          .compare(password, user.password)
          .then((isMatched) => (user && isMatched ? user : null));
      })
      .catch(() => false);
  }
}
