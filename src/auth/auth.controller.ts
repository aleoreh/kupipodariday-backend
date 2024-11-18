import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserAlreadyExistsEception } from '../exceptions/user-already-exists.exception';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    if (await this.usersService.findOneByUsername(createUserDto.username)) {
      throw new UserAlreadyExistsEception();
    }

    const user = await this.usersService.create(createUserDto);

    return this.authService.auth(user);
  }
}
