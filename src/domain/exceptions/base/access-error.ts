import { DomainError, DomainErrorParams } from './domain-error';
import { DomainErrorCode } from './domain-error-code';

export abstract class AccessError extends DomainError {
  protected constructor({ data, code, message }: DomainErrorParams) {
    super({
      domainErrorCode: DomainErrorCode.ACCESS,
      message,
      code,
      data,
    });
  }
}
