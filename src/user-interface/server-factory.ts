import express from 'express';
import * as http from 'http';
import { Dependencies } from '../container';
import { discoverService } from '../infrastructure/discover-service';

import bodyParser = require('body-parser');

export default function makeServerFactory({ mongoClient, errorHandlingMiddleware, mainRouter }: Dependencies) {
  return {
    createServer({ port, mongoDbUri }): Server {
      const expressServer = express();
      let httpConnection: http.Server;
      expressServer.use(bodyParser.json({ limit: '50mb' }));
      expressServer.use(mainRouter);
      expressServer.use(errorHandlingMiddleware);

      return {
        async start() {
          const serverWillStart = new Promise<void>((resolve) => (httpConnection = expressServer.listen(port, () => resolve())));
          const databaseWillConnect = mongoClient.connectToDatabase(mongoDbUri);
          await Promise.all([serverWillStart, databaseWillConnect]);
        },
        getConfig() {
          return { port, mongoDbUri };
        },
        getExpressApp() {
          return expressServer;
        },
      };
    },
  } as ServerFactory;
}

export type ServerOptions = { port: number; mongoDbUri: string };

export interface Server {
  start(): Promise<void>;

  getConfig(): ServerOptions;

  getExpressApp(): express.Express;
}

export interface ServerFactory {
  createServer(options: { port: number; mongoDbUri: string }): Server;
}
