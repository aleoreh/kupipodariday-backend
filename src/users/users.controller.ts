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
import { JwtGuard } from '../jwt/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { PublicUserDto } from './dto/public-user.dto';
import { SafeUserDto } from './dto/safe-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<SafeUserDto> {
    return this.usersService
      .create(createUserDto)
      .then((user) => new SafeUserDto(user));
  }

  @UseGuards(JwtGuard)
  @Get('me')
  findMe(@Req() req): Promise<SafeUserDto> {
    return this.usersService
      .findOne(req.user.id)
      .then((user) => new SafeUserDto(user));
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SafeUserDto> {
    return this.usersService
      .update(req.user.id, updateUserDto)
      .then((user) => new SafeUserDto(user));
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  getMeWishes(@Req() req) {
    return this.usersService.findOne(req.user.id).then((user) => user.wishes);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string): Promise<PublicUserDto> {
    return this.usersService
      .findOneByUsername(username)
      .then((user) => new PublicUserDto(user));
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService
      .findOneByUsername(username)
      .then((user) => user.wishes);
  }

  @Post('find')
  findMany(@Body() param: { query: string }): Promise<SafeUserDto[]> {
    return this.usersService
      .find(param.query)
      .then((users) => users.map((user) => new SafeUserDto(user)));
  }
}
