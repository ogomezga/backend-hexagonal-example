import exp from 'constants';
import { Express } from 'express';
import * as request from 'supertest';
import { resolveDependency } from '../../../infrastructure/dependency-injection';
import { TalkBuilder } from '../../test-helpers/builders/talk-builder';
import { getDefaultHandlers } from '../../test-helpers/setup-teardown';

describe('Schedule a talk', () => {
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

  afterAll(async () => {
    await databaseClient.dropDatabase();
    afterAllHandler();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('Given a talk should schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder().build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(201);
    // Then
    expect(response.body.title).toEqual(talk.title);
    expect(response.body.description).toEqual(talk.description);
    expect(response.body.speakers).toEqual(talk.speakers);
    expect(response.body.day).toEqual(talk.day);
    expect(response.body.duration).toEqual(talk.duration);
    expect(response.body.startHour).toEqual(talk.startHour);
    expect(response.body.endHour).toEqual(talk.endHour);
    expect(response.body.room).toEqual(talk.room);
  });

  test('Given a talk with the same title as last one should not schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder().build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(409);
    // Then
    expect(response.body.message).toEqual('This title is already in use for another talk');
    expect(response.body.code).toEqual('title-talk-business-conflic');
  });

  test('Given a talk without title should not schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder().with('title', null).build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(422);
    // Then
    expect(response.body.code).toEqual('route-validation-error');
  });

  test('Given a talk without description should not schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder().with('description', null).build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(422);
    // Then
    expect(response.body.code).toEqual('route-validation-error');
  });

  test('Given a talk without speakers should not schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder().with('speakers', null).build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(422);
    // Then
    expect(response.body.code).toEqual('route-validation-error');
  });

  test('Given a talk with an empty list of speakers should not schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder().with('speakers', []).build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(422);
    // Then
    expect(response.body.code).toEqual('route-validation-error');
  });

  test('Given a talk with a list of one speaker only should create it correctly', async () => {
    // Given
    const talk = new TalkBuilder().with('title', 'schedule a talk with a list of one speaker only').with('speakers', ['Speaker test']).build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(201);
    // Then
    expect(response.body.speakers).toEqual(talk.speakers);
  });

  test('Given a talk with a list of multiple speakers should schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder()
      .with('title', 'schedule a talk with a list of multiple speakers')
      .with('speakers', ['Speaker test one', 'Speaker test two'])
      .build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(201);
    // Then
    expect(response.body.speakers).toEqual(talk.speakers);
  });

  test('Given a talk without a day should not schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder().with('day', null).build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(422);
    // Then
    expect(response.body.code).toEqual('route-validation-error');
  });

  test('Given a talk with a day not allowed should not schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder().with('day', 3).build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(422);
    // Then
    expect(response.body.code).toEqual('route-validation-error');
  });

  test('Given a talk without a duration should not schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder().with('duration', null).build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(422);
    // Then
    expect(response.body.code).toEqual('route-validation-error');
  });

  test('Given a talk with a duration not allowed should not schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder().with('duration', -89).build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(422);
    // Then
    expect(response.body.code).toEqual('route-validation-error');
  });

  test('Given a talk with a duration shorter than the maximun should schedule it correctly', async () => {
    // Given
    const talk = new TalkBuilder()
      .with('title', 'schedule a talk with a duration shorter than the maximun')
      .with('duration', 45)
      .with('endHour', '13:45')
      .build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(201);
    // Then
    expect(response.body.duration).toEqual(talk.duration);
    expect(response.body.endHour).toEqual(talk.endHour);
  });

  test('Given a talk with a duration longer than the last working slot should schedule it correctly and create a new room', async () => {
    // Given
    await talkRepository.create(new TalkBuilder().with('endHour', '14:45').build());
    await talkRepository.create(new TalkBuilder().with('endHour', '15:45').build());
    await talkRepository.create(new TalkBuilder().with('endHour', '16:45').build());
    await talkRepository.create(new TalkBuilder().with('endHour', '17:45').build());
    const talk = new TalkBuilder()
      .with('title', 'schedule a talk with a longer duration')
      .with('room', '2')
      .with('duration', 60)
      .with('endHour', '11:00')
      .build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(201);
    // Then
    expect(response.body.duration).toEqual(talk.duration);
    expect(response.body.endHour).toEqual(talk.endHour);
    expect(response.body.room).toEqual(talk.room);
  });

  test('Given a talk with a duration of one working slot in a room before the last one used should schedule it correctly', async () => {
    // Given
    await talkRepository.create(new TalkBuilder().with('endHour', '17:45').build());
    const talk = new TalkBuilder().with('title', 'schedule a talk with just the right duration').with('duration', 15).build();
    const url = route();
    // When;
    const response = await request.agent(app).post(url).send(talk).expect(201);
    // Then
    expect(response.body.duration).toEqual(talk.duration);
    expect(response.body.startHour).toEqual('17:45');
    expect(response.body.endHour).toEqual('18:00');
  });
});
