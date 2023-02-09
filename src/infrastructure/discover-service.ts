// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

type ServiceName =
  | 'mongo_uri'
  | 'pg_user'
  | 'pg_host'
  | 'pg_database'
  | 'pg_password'
  | 'pg_port';

const mapEnv = {
  test: 'DEV',
  development: 'DEV',
  ['pre_production']: 'PRE',
  production: 'PROD',
};

export function discoverService(serviceName: ServiceName) {
  const env = mapEnv[process.env.NODE_ENV || 'development'] ;
  const value = process.env[`${env}_${serviceName.toUpperCase()}`];

  if (!value) {
    const exception = new Error(`Env configuration missing: ${serviceName}`);
    // eslint-disable-next-line no-console
    console.error({ layer: 'service-discovery', context: 'discoverService', level: 'error', exception, payload: { env: process.env } });
    throw exception;
  }

  return value;
}
