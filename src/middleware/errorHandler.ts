import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { errorResponse } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export const createError = (
  message: string,
  statusCode: number = 500,
  code?: string
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  if (code) {
    error.code = code;
  }
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message, code } = err;

  // 개발 환경에서는 자세한 에러 정보 로깅
  if (process.env.NODE_ENV === 'development') {
    logger.error('Error details:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
  } else {
    // 운영 환경에서는 간단한 에러 로깅
    logger.error(`${statusCode} - ${message} - ${req.url} - ${req.method} - ${req.ip}`);
  }

  // Joi 검증 에러 처리
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    code = 'VALIDATION_ERROR';
  }

  // JWT 에러 처리
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }

  // 몽구스 에러 처리 (필요시 추가)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_ID';
  }

  // 중복 키 에러 처리
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
    code = 'DUPLICATE_FIELD';
  }

  // 운영 환경에서는 민감한 에러 정보 숨기기
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    message = 'Something went wrong';
    code = 'INTERNAL_ERROR';
  }

  res.status(statusCode).json(errorResponse(message, err.stack, code));
};

// 비동기 함수 에러 처리 래퍼
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 에러 핸들러
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = createError(`Route not found: ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};
