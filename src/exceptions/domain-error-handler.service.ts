import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AccessDeniedError } from './access-denied.error';
import { AlreadyExistsError } from './already-exists.error';
import { DomainError } from './domain-error';

@Injectable()
export class DomainErrorHandler {
  toHttp(error: DomainError): HttpException {
    let httpStatus: HttpStatus | null = null;

    if (error instanceof AccessDeniedError) httpStatus = HttpStatus.FORBIDDEN;

    if (error instanceof AlreadyExistsError)
      httpStatus = HttpStatus.BAD_REQUEST;

    // используем статический метод логгера, так как метод toHttp используется
    // в контроллерах без привязки this (promise.catch(this.exceptionHandler.toHttp))
    Logger.error(`Ошибочка вышла: ${error.message}`, error.stack);

    switch (httpStatus) {
      case null:
        throw new HttpException(
          'Ошибка на стороне сервере',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      default:
        throw new HttpException(error.message, httpStatus);
    }
  }
}
