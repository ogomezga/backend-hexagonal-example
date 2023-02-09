import {ErrorRequestHandler, Request, Response} from 'express';
import {DomainError} from '../../../domain/exceptions/base/domain-error';
import {HintedValues} from '../../interfaces';
import {DomainErrorCodeToStatusCodeTransformer} from './domain-error-code-to-status-code-transformer';
import {HttpStatusCode} from './http-status-code';

export enum ErrorCode {}

export class HttpError extends Error {
  name: string = 'HttpError';
  code: HintedValues<ErrorCode>;
  message: string;
  statusCode?: HttpStatusCode;
  data?: any;

  constructor(args: Pick<HttpError, 'code'> & Partial<Pick<HttpError, 'statusCode' | 'data' | 'message'>>) {
    super();
    this.code = args.code;
    this.message = args.message || '';
    this.statusCode = args.statusCode || HttpStatusCode.BAD_REQUEST;
    this.data = args.data;
  }

  static fromDomainError(error: DomainError): HttpError {
    return new HttpError({
      code: error.code,
      message: error.message,
      data: error.data,
      statusCode: DomainErrorCodeToStatusCodeTransformer.transform(error.domainErrorCode),
    });
  }
}

export default function makeErrorHandlingMiddleware() {
  const handleHttpError = ({ req, res, error }: { req: Request; res: Response; error: HttpError }): void => {
    res.status(error?.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      code: error.code,
      data: error.data,
      statusCode: error.statusCode,
    });
  };

  const handleDomainError = ({ req, res, error }: { req: Request; res: Response; error: DomainError }): void => {
    const httpException = HttpError.fromDomainError(error);
    handleHttpError({ req, res, error: httpException });
  };


  return function (error, req, res, next) {

    if (error instanceof DomainError) {
      return handleDomainError({ req, res, error });
    } else if (error instanceof HttpError || error.name === 'HttpError') {
      return handleHttpError({ req, res, error });
    }
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false });
  } as ErrorRequestHandler;
};
