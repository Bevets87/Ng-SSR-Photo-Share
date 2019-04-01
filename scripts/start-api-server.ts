import chalk from 'chalk';
import * as express from 'express';
import { config } from '../config';
import { database } from '../server/db';
import { middleware } from '../server/middleware';
import { routes } from '../server/routes';
import { errorware } from '../server/errorware';

export const startApiServer = async () => {
  const app = express();
  middleware(app);
  routes(app);
  errorware(app);
  await database.connect();
  await database.setup();
  await database.seed({ users: 100, tags: 100 });
  app.listen(config.port, () => {
    const message = `server listening on ${config.base_url}`;
    console.log(chalk.yellowBright(message));
  });
};

startApiServer();
