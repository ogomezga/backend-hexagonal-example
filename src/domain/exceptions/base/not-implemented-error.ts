import { DomainError, DomainErrorParams } from './domain-error';
import { DomainErrorCode } from './domain-error-code';

export abstract class NotImplementedError extends DomainError {
  protected constructor({ data, code, message }: DomainErrorParams) {
    super({
      domainErrorCode: DomainErrorCode.NOT_IMPLEMENTED,
      message,
      code,
      data,
    });
  }
}
