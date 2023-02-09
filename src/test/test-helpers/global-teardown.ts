module.exports = async () => {
  const mongod = (global as any).__MONGOD__;
  await mongod.stop();
};
