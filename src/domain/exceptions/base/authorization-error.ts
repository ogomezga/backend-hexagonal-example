import { DomainError, DomainErrorParams } from './domain-error';
import { DomainErrorCode } from './domain-error-code';

export abstract class AuthorizationError extends DomainError {
  protected constructor({ data, code, message }: DomainErrorParams) {
    super({
      domainErrorCode: DomainErrorCode.AUTHORIZATION,
      message,
      code,
      data,
    });
  }
}
