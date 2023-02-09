import Pino = require('pino');
import {isTestingEnv} from './environment';
import {FunctionType} from './interfaces';

const logger = Pino(
  {
    base: null,
    timestamp: true,
    redact: ['password', '*.password', 'grossSalary', '*.grossSalary'],
    messageKey: 'message',
    prettyPrint: {
      colorize: true,
      messageKey: 'message',
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      levelFirst: true,
      crlf: true,
    },
  level: isTestingEnv() ? 'silent': 'debug',
  } as Pino.LoggerOptions,
  Pino.destination({ sync: false }),
);

export class Logger {
  public info(msg: string, ...moreMsgs: string[]) {
    logger.info(msg, ...moreMsgs);
  }

  public error(msg: string, ...moreMsgs: string[]) {
    logger.error(msg, ...moreMsgs);
  }
}


export function withLogger<T extends FunctionType>(fn: T): T {
  if (fn.name === '') {
    throw new Error('The function cannot be anonymous');
  }
  return function (...args: Parameters<T>) {
    const _logger = args[args.length - 1] instanceof Logger ? args[args.length - 1] : new Logger();
    _logger.logRequest({ payload: args });
    const response = fn.apply(this, [...args, _logger]);
    if (response instanceof Promise) {
      return response
        .then((responseSolved) => {
          _logger.logResponse({ payload: responseSolved });
          return responseSolved;
        })
        .catch((exception) => {
          _logger.logAndThrow({ exception });
        });
    } else {
      _logger.logResponse({ payload: response });
      return response;
    }
  } as T;
}
