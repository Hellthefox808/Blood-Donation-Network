import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { Role, UserPayload } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      type: 'https://api.bdn.org/errors/unauthenticated',
      title: 'Authentication Required',
      status: 401,
      detail: 'Missing or invalid Authorization header.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      type: 'https://api.bdn.org/errors/token-invalid',
      title: 'Invalid or Expired Token',
      status: 401,
      detail: 'The provided Bearer token is invalid or has expired.',
    });
  }
}

export function requireRole(allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        type: 'https://api.bdn.org/errors/unauthenticated',
        title: 'Authentication Required',
        status: 401,
        detail: 'Authentication required prior to access.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        type: 'https://api.bdn.org/errors/forbidden',
        title: 'Forbidden Action',
        status: 403,
        detail: `User role '${req.user.role}' is not authorized to access this resource. Required roles: [${allowedRoles.join(', ')}].`,
      });
    }

    next();
  };
}
