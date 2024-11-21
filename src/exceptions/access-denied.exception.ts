import { DomainException } from './exception';

export class AccessDeniedException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
