import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { enableProdMode } from '@angular/core';
import { Request, Response } from 'express';

import * as xhr2 from 'xhr2';
xhr2.prototype._restrictedHeaders.cookie = false;
xhr2.prototype._restrictedHeaders.connection = false;
xhr2.prototype._restrictedHeaders.host = false;

const path = require('path');
const express = require('express');
const { config } = require('./config');
const { database } = require('./server/db');
const { middleware } = require('./server/middleware');
const { routes } = require('./server/routes');
const { errorware } = require('./server/errorware');
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

const connectDatabase = async (server) => {
  await database.connect();
  await database.setup();
  await database.seed({ users: 50, tags: 50 });
  server.listen(config.port, () => {
    const message = `server listening on ${config.base_url}`;
    console.log(message);
  });

};

enableProdMode();
const app = express();
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
app.set('view engine', 'html');
app.set('views', path.join(process.cwd(), 'dist', 'browser'));
middleware(app);
routes(app);
app.get('*.*', express.static(path.join(process.cwd(), 'dist', 'browser')));
app.get('*', (req: Request, res: Response) => {
  res.render(
    path.join(process.cwd(), 'dist', 'browser', 'index.html'),
    {
      req,
      res,
      providers: [
        {
          provide: 'BASE_URL', useValue: config.base_url
        },
        {
          provide: 'HEADERS', useValue: req.headers
        }

      ]
    }
  );
});
errorware(app);
connectDatabase(app);




