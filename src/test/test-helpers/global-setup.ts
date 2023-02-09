import { MongoMemoryReplSet } from 'mongodb-memory-server';


module.exports = async () => {
  process.env.TZ = 'UTC';
  (global as any).__MONGOD__ = await MongoMemoryReplSet.create({
    instanceOpts: [{ port: 27020 }],
    replSet: {
      count: 1,
      name: 'test-rs',
      storageEngine: 'wiredTiger',
    },
  });
};
