import { Application } from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as noFavicon from 'no-favicon';
import { queryParser } from './query-parser';

const { config } = require('../../config');
const { connection } = require('../db');
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const sessionStore = new MySqlStore({}, connection);


export const middleware = (app: Application) => {
  app.use(noFavicon());
  app.use(compression());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(queryParser());
  app.use(helmet());
  app.use(
    session({
      secret: config.session_secret,
      store: sessionStore,
      saveUninitialized: false,
      resave: false
    })
  );
};
