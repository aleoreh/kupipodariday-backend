import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccessDeniedException } from './access-denied.exception';
import { DomainException } from './exception';

@Injectable()
export class DomainExceptionHandler {
  private httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  toHttpException(error: DomainException): HttpException {
    if (error instanceof AccessDeniedException)
      this.httpStatus = HttpStatus.FORBIDDEN;

    return new HttpException(error, this.httpStatus);
  }
}
