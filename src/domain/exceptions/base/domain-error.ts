import {Properties} from '../../../infrastructure/interfaces';
import { DomainErrorCode } from './domain-error-code';

export type DomainErrorParams = { data?: Record<string, any>; code: string; message: string };

export abstract class DomainError extends Error {
  private static readonly errorName = 'domain-error';

  readonly code: string;
  readonly domainErrorCode: DomainErrorCode;
  readonly message: string;
  readonly data?: Record<string, any>;

  protected constructor({ code, message, data, domainErrorCode }: Omit<Properties<DomainError>, 'name'>) {
    super();
    this.code = code;
    this.domainErrorCode = domainErrorCode;
    this.message = message;
    this.data = data;
    this.name = DomainError.errorName;
  }
}
