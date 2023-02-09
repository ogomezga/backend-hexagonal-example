import * as joi from 'joi';
import {HttpError} from './middleware/error-handling-middleware/error-handling-middleware';

export const validate = (inputValue: any, schema: joi.ObjectSchema, customOptions: joi.ValidationOptions = {}) => {
  const options: joi.ValidationOptions = Object.assign<joi.ValidationOptions, joi.ValidationOptions>(
    { stripUnknown: true, convert: true, abortEarly: false },
    customOptions,
  );
  const { error, value, warning } = schema.validate(inputValue, options);
  if (error) {
    throw new HttpError({
      code: 'route-validation-error',
      message: error.message,
      statusCode: 422,
      data: { details: error.details, warnings: warning },
    });
  }
  return value;
};
