import { Express } from 'express';
import * as request from 'supertest';
import { resolveDependency } from '../../../infrastructure/dependency-injection';
import { TalkBuilder } from '../../test-helpers/builders/talk-builder';
import { getDefaultHandlers } from '../../test-helpers/setup-teardown';

describe('Find all talks', () => {
  const talkRepository = resolveDependency('talkRepository');
  const serverFactory = resolveDependency('serverFactory');
  const databaseClient = resolveDependency('mongoClient');
  const { afterAllHandler, beforeAllHandler, mongoUri } = getDefaultHandlers(databaseClient);

  let app: Express;

  const route = () => {
    return '/talks';
  };

  beforeAll(async () => {
    await beforeAllHandler();
    app = serverFactory.createServer({ port: 4353, mongoDbUri: mongoUri }).getExpressApp();
  });

  afterAll(afterAllHandler);

  beforeEach(async () => {
    jest.clearAllMocks();
    await databaseClient.dropDatabase();
  });

  test('No talks to list', async () => {
    // Given
    const url = route();
    // When;
    const response = await request.agent(app).get(url).expect(200);
    // Then
    expect(response.body).toEqual([]);
  });

  test('List talks', async () => {
    // Given
    const talk = await talkRepository.create(new TalkBuilder().build());
    const url = route();
    // When;
    const response = await request.agent(app).get(url).expect(200);
    // Then
    expect(response.body).toEqual([talk]);
  });
});
