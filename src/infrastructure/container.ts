import {asValue} from 'awilix';
import * as awilix from 'awilix';
import * as pgLib from 'pg';
import {asSingletonFunction, RegistrationMap} from './dependency-injection';
import makeErrorHandlingMiddleware from './middleware/error-handling-middleware/error-handling-middleware';
import makePgClient, {PgClientInterface} from './pg-client';
import { getRepositoryContainer, RepositoryDependencies } from './repository/container';
import makeMongoClient, {MongoClient} from './mongo-client';

import express from 'express';

let container:awilix.AwilixContainer;

export function getInfrastructureContainer() {
  if (!container) {
    container = awilix.createContainer();
    container.register({
      mongoClient: asSingletonFunction(makeMongoClient),
      errorHandlingMiddleware: asSingletonFunction(makeErrorHandlingMiddleware),
      pgLib: asValue(pgLib),
      pgClient: asValue(makePgClient),
    } as RegistrationMap<OnlyInfrastructureDependencies>);

    container.register(getRepositoryContainer().registrations);
  }
  return container;
}

type OnlyInfrastructureDependencies = {
  mongoClient: MongoClient;
  errorHandlingMiddleware: express.RequestHandler;
  pgLib: typeof pgLib;
  pgClient: PgClientInterface;
};

export type InfrastructureDependencies = OnlyInfrastructureDependencies & RepositoryDependencies;
