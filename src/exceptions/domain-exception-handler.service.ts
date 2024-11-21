import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccessDeniedException } from './access-denied.ecxeption';
import { DomainException } from './domain-exception';
import { AlreadyExistsException } from './user-already-exists.exception';

@Injectable()
export class DomainExceptionHandler {
  toHttp(error: DomainException): HttpException {
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (error instanceof AccessDeniedException)
      httpStatus = HttpStatus.FORBIDDEN;

    if (error instanceof AlreadyExistsException)
      httpStatus = HttpStatus.BAD_REQUEST;

    throw new HttpException(error.message, httpStatus);
  }
}
