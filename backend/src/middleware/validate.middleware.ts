import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const invalidParams = error.errors.map((err) => ({
          name: err.path.join('.'),
          reason: err.message,
        }));

        return res.status(400).json({
          type: 'https://api.bdn.org/errors/validation-error',
          title: 'Invalid Request Input',
          status: 400,
          detail: 'One or more request parameters failed validation.',
          instance: req.originalUrl,
          invalidParams,
        });
      }
      next(error);
    }
  };
}
