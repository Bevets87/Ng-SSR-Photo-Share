import * as mysql from 'mysql';
import { config } from '../../config';
import { MySqlFacade } from './mysql-facade';

export const connection = mysql.createConnection({
  host: config.db_host,
  user: config.db_user,
  password: config.db_password,
  port: config.db_port,
  database: config.db_database
});

export const database = new MySqlFacade(connection);
