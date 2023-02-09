import * as mongodb from 'mongodb';
import {Logger} from './log';

function mergeOptionsWithDefaults(options: mongodb.MongoClientOptions = {}): mongodb.MongoClientOptions {
  return Object.assign<mongodb.MongoClientOptions, mongodb.MongoClientOptions>(
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    options,
  );
}

export default function makeMongoClient ()  {
  let db: mongodb.Db | null = null;
  let client: mongodb.MongoClient | null = null;
  const collections: Record<string, mongodb.Collection> = {};
  const logger = new Logger();

  return {
    async connectToDatabase(uri, options) {
      let heartbeatFailed = false;
      client = await new mongodb.MongoClient(uri, mergeOptionsWithDefaults(options))
        .on('serverHeartbeatFailed', () => {
          if (!heartbeatFailed) {
            heartbeatFailed = true;
            logger.error(`Connection to database lost (uri: "${uri}")`);
          }
        })
        .on('serverHeartbeatSucceeded', function () {
          if (heartbeatFailed) {
            heartbeatFailed = false;
            logger.info(`Reconnected to database lost (uri: "${uri}")`);
          }
        })
        .on('serverOpening', () => logger.info('serverOpening'))
        .on('serverClosed', () => logger.info('serverClosed'))
        .connect();
      db = client.db();
    },
    async disconnectToDatabase() {
      if (client) {
        await client.close();
      }
      client = null;
      db = null;
    },
    async dropDatabase() {
      if (client) {
        await db.dropDatabase();
      }
    },
    getCollection(name) {
      if (!collections[name]) {
        if (!db) {
          throw new Error('Not connected to database. Please call "connectToDb" first.');
        }
        collections[name] = db.collection(name);
      }
      return collections[name];
    },
  } as MongoClient;
};

export interface MongoClient {
  connectToDatabase(uri: string, options?: mongodb.MongoClientOptions): Promise<any>;

  disconnectToDatabase(): Promise<any>;

  getCollection(name: string): mongodb.Collection;

  dropDatabase(): Promise<void>;
}

interface AdaptResultMethod {
  (result: null | undefined): null;

  (result: mongodb.InsertOneWriteOpResult<any> | mongodb.FindAndModifyWriteOpResultObject<any>): any;

  (result: mongodb.InsertWriteOpResult<any>): any[];

  (result: mongodb.InsertOneWriteOpResult<any> | mongodb.FindAndModifyWriteOpResultObject<any> | mongodb.InsertWriteOpResult<any>): any | any[];
}

export const adaptResult: AdaptResultMethod = (
  result: mongodb.InsertOneWriteOpResult<any> | mongodb.FindAndModifyWriteOpResultObject<any> | mongodb.InsertWriteOpResult<any> | null | undefined,
) => {
  if (!result) {
    return null;
  } else if ('value' in result) {
    return retrieveFindAndModifyWriteOpResult(result as mongodb.FindAndModifyWriteOpResultObject<any>);
  } else if ('insertedIds' in result) {
    return retrieveInsertManyResult(result as mongodb.InsertWriteOpResult<any>);
  } else {
    return retrieveInsertOneResult(result as mongodb.InsertOneWriteOpResult<any>);
  }
};

function retrieveInsertManyResult(result: mongodb.InsertWriteOpResult<any>) {
  return result.ops;
}

function retrieveInsertOneResult(result: mongodb.InsertOneWriteOpResult<any>) {
  return result.ops.pop();
}

function retrieveFindAndModifyWriteOpResult(result: mongodb.FindAndModifyWriteOpResultObject<any>) {
  return result.value;
}
