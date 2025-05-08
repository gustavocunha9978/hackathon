import AppError from '@shared/errors/AppErrors';
import { NextFunction, Request, Response } from 'express';

const ErrorHandler = (
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response | void => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      duplicity: err.duplicity,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: `Internal server error -> ${err.message}`,
  });
};

export default ErrorHandler;
