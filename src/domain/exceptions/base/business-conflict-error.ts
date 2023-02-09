import { DomainError, DomainErrorParams } from './domain-error';
import { DomainErrorCode } from './domain-error-code';

export abstract class BusinessConflictError extends DomainError {
  protected constructor({ data, code, message }: DomainErrorParams) {
    super({
      domainErrorCode: DomainErrorCode.BUSINESS_CONFLICT,
      message,
      code,
      data,
    });
  }
}
