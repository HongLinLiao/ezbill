import type { Request, Response, NextFunction } from 'express';

import { UnauthorizedError } from '../utils/response';
import { type JWT, verifyToken } from '../utils/jwt';

export const AuthMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  getCurrentUser(req);
  next();
};

export function getCurrentUser(req: Request): JWT {
  try {
    const { authorization } = req.headers;
    return verifyToken(authorization?.split(' ')[1] ?? '');
  } catch (e) {
    throw new UnauthorizedError(String(e));
  }
}
