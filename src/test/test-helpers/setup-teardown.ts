import {v4 as uuidv4} from 'uuid';
import {MongoClient} from '../../infrastructure/mongo-client';

export const getMemServerUri = (dbName: string) => `mongodb://localhost:27020/${dbName}?replicaSet=test-rs`;

export function getDefaultHandlers(databaseClient: MongoClient) {
  const mongoUri = getMemServerUri(uuidv4());
  return {
    mongoUri,
    beforeAllHandler: defaultBeforeAllHandler({databaseClient, mongoUri}),
    afterAllHandler: defaultAfterAllHandler(databaseClient),
  };
}

export function defaultBeforeAllHandler({mongoUri,databaseClient}: {databaseClient: MongoClient; mongoUri: string}) {
  return async () => {
    await databaseClient.connectToDatabase(mongoUri);
  };
}

export function defaultAfterAllHandler(databaseClient: MongoClient) {
  return async () => {
    await databaseClient.disconnectToDatabase();
  };
}
