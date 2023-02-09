import {DomainErrorCode} from '../../../domain/exceptions/base/domain-error-code';
import {HttpStatusCode} from './http-status-code';

export class DomainErrorCodeToStatusCodeTransformer {
  private static equivalences: { [error in DomainErrorCode]: number } = {
    [DomainErrorCode.NOT_FOUND]: HttpStatusCode.NOT_FOUND,
    [DomainErrorCode.BUSINESS_CONFLICT]: HttpStatusCode.CONFLICT,
    [DomainErrorCode.ACCESS]: HttpStatusCode.FORBIDDEN,
    [DomainErrorCode.THIRD_PARTY]: HttpStatusCode.INTERNAL_SERVER_ERROR,
    [DomainErrorCode.AUTHORIZATION]: HttpStatusCode.NOT_AUTHORIZED,
    [DomainErrorCode.NOT_IMPLEMENTED]: HttpStatusCode.NOT_IMPLEMENTED,
  };

  static transform(error: DomainErrorCode): number {
    const statusCode = DomainErrorCodeToStatusCodeTransformer.equivalences[error];
    if (!statusCode) {
      return HttpStatusCode.INTERNAL_SERVER_ERROR;
    }
    return statusCode;
  }
}
