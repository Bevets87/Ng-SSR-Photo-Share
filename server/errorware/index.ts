import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
export const handleError: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) { console.error(err.stack); }
  res.status(500).json({ message: 'internal server error' });
};


export const errorware = (app) => {
  app.use(handleError);
};
