import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[Unhandled API Error]:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    type: err.type || 'https://api.bdn.org/errors/internal-server-error',
    title: err.title || 'Internal Server Error',
    status: statusCode,
    detail: message,
    instance: req.originalUrl,
  });
}
