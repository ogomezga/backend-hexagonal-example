import * as joi from 'joi';
import * as express from 'express';
import { validate } from '../validation';

export const validateRequestPayload = (schema: joi.ObjectSchema, type: ValidationTarget, customOptions: joi.ValidationOptions = {}) => {
  const middleware: express.RequestHandler = (req, res, next) => {
    const inputValue = req[type] || {};
    try {
      req[type] = validate(inputValue, schema, customOptions);
      return next();
    } catch (e) {
      return next(e);
    }
  };
  return middleware;
};

export enum ValidationTarget {
  BODY = 'body',
  PARAMS = 'params',
  QUERY = 'query',
}
