import { resolveDependency } from './infrastructure/dependency-injection';

const serverFactory = resolveDependency('serverFactory');

const server = serverFactory.createServer({ port: 3000, mongoDbUri: 'mongodb://localhost:27017/local-dev?replicaSet=rs0' });

server
  .start()
  .then(() => console.info('Server started: ', server.getConfig()))
  .catch((reason) => console.error('Error en in server: ', reason));
