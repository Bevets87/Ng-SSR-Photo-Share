import * as mysql from 'mysql';
import { config } from '../../config';
import { MySqlFacade } from './mysql-facade';
let envConnection;
if (process.env.NODE_ENV === 'production') {
  envConnection = mysql.createConnection(config.db_url);

} else {
  envConnection = mysql.createConnection({
    host: config.db_host,
    user: config.db_user,
    password: config.db_password,
    database: config.db_database
  });
}

export const connection = envConnection;

export const database = new MySqlFacade(connection);
