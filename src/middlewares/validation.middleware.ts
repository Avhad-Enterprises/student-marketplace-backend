import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import HttpException from '../exceptions/HttpException';

/**
 * Middleware to validate request body, params, or query against a DTO.
 * 
 * @param type The DTO class to validate against
 * @param value The field of the request object to validate: 'body', 'query', or 'params'
 * @param skipMissingProperties Whether to skip missing properties in validation
 * @param whitelist Whether to remove non-whitelisted properties
 * @param forbidNonWhitelisted Whether to fail validation if non-whitelisted properties are found
 */
const validationMiddleware = (
  type: any,
  value: 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    const obj = plainToInstance(type, req[value]);
    validate(obj, { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints || {})).join(', ');
        next(new HttpException(400, message));
      } else {
        // Replace request data with cleaned, typed instance if desired
        // req[value] = obj; 
        next();
      }
    });
  };
};

export default validationMiddleware;
