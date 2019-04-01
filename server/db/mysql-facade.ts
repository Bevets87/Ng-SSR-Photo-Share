import chalk from 'chalk';
import { Connection, MysqlError } from 'mysql';
import { creates, drops } from './mysql-tables';
import { createSeed, SeedOptions } from './mysql-seed';



export interface MySqlConfig {
  host: string;
  port: number;
  database: string;
  password: string;
  user: string;
}

export interface MysqlResultInfo {
  affectedRows: number;
  changedRows: number;
  fieldCount: number;
  insertId: number;
  message: string;
  protocol41: boolean;
  serverStatus: number;
  warningCount: number;
}


export class MySqlFacade {

  private connection: Connection;
  constructor(connection: Connection) {
    this.connection = connection;
  }
  private async dropTables() {

    await Promise.all(drops().map(s => this.query(s)));
  }
  private async createTables() {
    await Promise.all(creates().map(s => this.query(s)));
  }
  async setup() {
    await this.dropTables();
    await this.createTables();
  }
  getConfig(): MySqlConfig {
    return {
      host: this.connection.config.host,
      port: this.connection.config.port,
      database: this.connection.config.database,
      password: this.connection.config.password,
      user: this.connection.config.user
    };
  }
  getState(): string {
    return this.connection.state;
  }
  connect(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.connection.connect((error: MysqlError) => {
        if (error) { reject(error); }
        const message = `${this.connection.config.database} connected to: ${this.connection.config.host}`;
        console.log(chalk.greenBright(message));
        resolve(message);
      });
    });
  }
  disconnect(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.connection.end((error: MysqlError) => {
        if (error) { reject(error); }
        const message = `${this.connection.config.database} disconnected from: ${this.connection.config.host}`;
        console.log(chalk.redBright(message));
        resolve(message);
      });
    });
  }
  query(s: string, values?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(s, values, (error: MysqlError, results: any[] | MysqlResultInfo) => {
        const message = s.split('(')[0];
        if (error) { console.error(chalk.bgRedBright(message)); return reject(error); }

        resolve(results);
      });
    });
  }

  async seed(options: SeedOptions) {
    await createSeed(options);
  }




}

