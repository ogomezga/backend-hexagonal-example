import { QueryResult } from 'pg';
import {InfrastructureDependencies} from './container';
import {discoverService} from './discover-service';


export type SQLQuery = {
  sql: string;
  params?: (string | number | boolean | (string | number | boolean)[])[];
};

type Row = {
  [key: string]: string | number | boolean;
};

export default function makePgClient({ pgLib }: InfrastructureDependencies): PgClientInterface {
  const pool = new pgLib.Pool({
    user: discoverService('pg_user'),
    host: discoverService('pg_host'),
    database: discoverService('pg_database'),
    password: discoverService('pg_password'),
    port: parseInt(discoverService('pg_port'), 10),
  });

  function buildInsertQuery(table: string, row: Row): SQLQuery {
    const fieldsArray = Object.keys(row).filter((key) => row[key] !== undefined);
    const templateString = fieldsArray.map((_, idx) => `$${idx + 1}`).join(', ');
    return {
      sql: `INSERT INTO ${table} (${fieldsArray.join(', ')}) VALUES (${templateString})`,
      params: fieldsArray.map((key) => row[key]),
    };
  }

  function buildUpdateQuery(table: string, keys: Row, row: Row): SQLQuery {
    const fieldsArray = Object.keys(row).filter((key) => row[key] !== undefined);
    const updateString = fieldsArray.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
    const conditionString = Object.keys(keys)
      .map((field, idx) => `${field} = $${fieldsArray.length + idx + 1}`)
      .join(' AND ');

    return {
      sql: `UPDATE ${table} SET ${updateString} WHERE (${conditionString})`,
      params: fieldsArray.map((key) => row[key]).concat(Object.keys(keys).map((key) => keys[key])),
    };
  }

  async function query({ sql, params = [] }) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await pool.query(sql, params);
    } catch (error) {
      throw error;
    }
  }

  return {
    query,
    async findRecords(sqlQuery) {
      const result = await query(sqlQuery);
      return result.rows;
    },
    async closeConnection() {
      await pool.end();
    },
    async insert(table: string, rows: Row[]) {
      for (const row of rows) {
        await query(buildInsertQuery(table, row));
      }
    },

    async updateByFields(table: string, keys: Row, object: Row) {
      return query(buildUpdateQuery(table, keys, object));
    },

    async checkConnection() {
      return query({ sql: 'SELECT 1' });
    },
  };
}

export interface PgClientInterface {
  closeConnection(): Promise<void>;
  query(query: SQLQuery): Promise<QueryResult<any>>;
  findRecords(query: SQLQuery): Promise<any[][]>;
  insert(table: string, rows: Row[]): Promise<void>;
  updateByFields(table: string, keys: Row, object: Row): Promise<QueryResult<any>>;
  checkConnection(): Promise<QueryResult<any>>;
}
