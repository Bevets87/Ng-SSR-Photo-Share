import { Application } from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as noFavicon from 'no-favicon';
import * as session from 'express-session';
import { queryParser } from './query-parser';


const { config } = require('../../config');
const MySqlStore = require('express-mysql-session')(session);

let sessionStore;

if (process.env.NODE_ENV === 'production') {

  sessionStore = new MySqlStore(config.db_url);

} else {

  sessionStore = new MySqlStore({
    host: config.db_host,
    port: config.db_port,
    password: config.db_password,
    user: config.db_user,
    database: config.db_database,
  });
}

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
