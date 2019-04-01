import * as express from 'express';
import {
  Request, Response, Application
} from 'express';
import { middleware } from '../middleware';
import { routes } from '../routes';
import { NextFunction } from 'connect';

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;

export const testValidationMiddlewares = async (middlewares: ExpressMiddleware[], config) => {
  const request: Partial<Request> = {};
  const response: Partial<Response> = {};
  const next = jest.fn();
  const status = jest.fn().mockReturnThis();
  const json = jest.fn().mockReturnThis();
  const body = config.body || {};
  const query = config.query || {};
  const params = config.params || {};

  const req = Object.assign(request, { body, query, params });
  const res = Object.assign(response, { json, status });

  const validations = middlewares.slice();

  const handleError = validations.pop();

  await Promise.all(validations.map(v => v(<Request>req, <Response>res, next)));
  handleError(<Request>req, <Response>res, next);

  return { req, res, next };

};

export const setupTestServer = () => {
  const app = express();
  middleware(app);
  routes(app);
  return app;
};


