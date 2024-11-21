import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccessDeniedError } from './access-denied.error';
import { DomainError } from './domain-error';
import { AlreadyExistsError } from './already-exists.error';

@Injectable()
export class DomainErrorHandler {
  toHttp(error: DomainError): HttpException {
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (error instanceof AccessDeniedError) httpStatus = HttpStatus.FORBIDDEN;

    if (error instanceof AlreadyExistsError)
      httpStatus = HttpStatus.BAD_REQUEST;

    throw new HttpException(error.message, httpStatus);
  }
}
