import { Request, Response, NextFunction } from 'express';

import {
  ResponseError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} from '../utils/response';

export const ErrorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let response: ResponseError;

  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError
  ) {
    response = {
      name: err.name,
      status: err.status,
      message: err.message,
    };
  } else {
    response = {
      name: err.name,
      status: 500,
      message: err.message,
    };
  }

  res.status(response.status).json(response);
};
