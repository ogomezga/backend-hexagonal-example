import { DomainError, DomainErrorParams } from './domain-error';
import { DomainErrorCode } from './domain-error-code';

export abstract class ThirdPartyError extends DomainError {
  protected constructor({ data, code, message }: DomainErrorParams) {
    super({
      domainErrorCode: DomainErrorCode.THIRD_PARTY,
      message,
      code,
      data,
    });
  }
}
