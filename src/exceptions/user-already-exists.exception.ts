import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsEception extends HttpException {
  constructor() {
    super('Такой пользователь существует', HttpStatus.BAD_REQUEST);
  }
}
