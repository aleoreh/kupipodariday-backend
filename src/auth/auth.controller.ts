import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { DomainErrorHandler } from '../errors/domain-error-handler.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly exceptionHandler: DomainErrorHandler,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService
      .create(createUserDto)
      .then((user) => {
        return this.authService.auth(user);
      })
      .catch(this.exceptionHandler.toHttp);
  }
}
