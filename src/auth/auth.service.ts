import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signin(user: User) {
    const payload = { id: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
