import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DomainErrorHandler } from '../errors/domain-error-handler.service';
import { JwtGuard } from '../jwt/jwt.guard';
import { PublicUserDto } from './dto/public-user.dto';
import { SafeUserDto } from './dto/safe-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly errorHandler: DomainErrorHandler,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  findMe(@Req() req) {
    return this.usersService
      .findMe(req.user.id)
      .then((user) => new SafeUserDto(user))
      .catch(this.errorHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService
      .update(req.user.id, updateUserDto)
      .then((user) => new SafeUserDto(user))
      .catch(this.errorHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  getMeWishes(@Req() req) {
    return this.usersService
      .findByIdWithWishes(req.user.id)
      .then((user) => user.wishes)
      .catch(this.errorHandler.toHttp);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService
      .findByUsername(username)
      .then((user) => new PublicUserDto(user))
      .catch(this.errorHandler.toHttp);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService
      .findByUsernameWithWishes(username)
      .then((user) => user.wishes)
      .catch(this.errorHandler.toHttp);
  }

  @Post('find')
  findMany(@Body() param: { query: string }) {
    return this.usersService
      .find(param.query)
      .then((users) => users.map((user) => new SafeUserDto(user)))
      .catch(this.errorHandler.toHttp);
  }
}
