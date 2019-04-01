import { sql } from './sql-string';

describe('Sql String', () => {

  it('can syntax hi lite sql and convert to a string', () => {
    const sqlString = sql`CREATE DATABASE test;`;

    expect(sqlString).toBe('CREATE DATABASE test;');
  });

});
