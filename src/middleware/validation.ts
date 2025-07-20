import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { createError } from './errorHandler';

interface ValidationOptions {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

export const validateRequest = (schemas: ValidationOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Body 검증
    if (schemas.body) {
      const { error } = schemas.body.validate(req.body, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => `Body: ${detail.message}`));
      }
    }

    // Query 검증
    if (schemas.query) {
      const { error } = schemas.query.validate(req.query, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => `Query: ${detail.message}`));
      }
    }

    // Params 검증
    if (schemas.params) {
      const { error } = schemas.params.validate(req.params, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => `Params: ${detail.message}`));
      }
    }

    if (errors.length > 0) {
      const error = createError(
        `Validation failed: ${errors.join(', ')}`,
        400,
        'VALIDATION_ERROR'
      );
      return next(error);
    }

    next();
  };
};

// 개별 검증 함수들
export const validateBody = (schema: Joi.ObjectSchema) => {
  return validateRequest({ body: schema });
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return validateRequest({ query: schema });
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return validateRequest({ params: schema });
};
