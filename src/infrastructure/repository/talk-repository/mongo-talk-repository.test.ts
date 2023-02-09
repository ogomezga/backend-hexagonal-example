import { Collection } from 'mongodb';
import { Talk } from '../../../domain/entities/talk';
import { TalkBuilder } from '../../../test/test-helpers/builders/talk-builder';
import { getDefaultHandlers } from '../../../test/test-helpers/setup-teardown';
import * as prueba from '../../mongo-client';
import makeMongoClient from '../../mongo-client';
import makeMongoTalkRepository, { adapt, restore } from './mongo-talk-repository';

import { v4 as uuidv4 } from 'uuid';

describe('mongoCatRepository', () => {
  const mongoClient = makeMongoClient();
  const { afterAllHandler, beforeAllHandler } = getDefaultHandlers(mongoClient);
  const mongoTalkRepository = makeMongoTalkRepository({ mongoClient });
  let collection: Collection;

  beforeAll(async () => {
    await beforeAllHandler();
    collection = mongoClient.getCollection('talks');
  });

  afterAll(async () => {
    await afterAllHandler();
  });

  beforeEach(async () => {
    await mongoClient.dropDatabase();
  });

  async function scheduleSomeTalks(talksSettings: { id?: string }[]): Promise<Talk[]> {
    let scheduledMockedTalks = talksSettings.map(({ id = uuidv4() }) => new TalkBuilder().with('id', id).build());
    scheduledMockedTalks = scheduledMockedTalks.map((mockedTalk) => adapt(mockedTalk));
    await collection.insertMany(scheduledMockedTalks);
    return scheduledMockedTalks.map((unrestoredMock) => restore(unrestoredMock));
  }

  test('Given a new talk shoud schedule it correctly', async () => {
    // Given
    expect((await mongoTalkRepository.findAll()).length).toEqual(0);
    const talk = new TalkBuilder().build();
    // When
    const createdTalk = await mongoTalkRepository.create(talk);
    // Then
    expect((await mongoTalkRepository.findAll()).length).toEqual(1);
    expect(createdTalk).toEqual(talk);
  });

  test('Given a list of scheduled talks should retrieve those talks', async () => {
    // Given
    const scheduledMockTalks = await scheduleSomeTalks([{ id: 'any-talk-id' }, { id: 'other-talk-id' }]);
    // When
    const scheduledTalks = await mongoTalkRepository.findAll();
    // Then
    expect(await collection.countDocuments()).toEqual(2);
    expect(scheduledTalks).toHaveLength(2);
    expect(scheduledTalks).toEqual(scheduledMockTalks);
  });

  test('Given a new talk should not schedule it', async () => {
    jest.spyOn(prueba, 'adaptResult').mockReturnValue(null);
    // Given
    expect((await mongoTalkRepository.findAll()).length).toEqual(0);
    const talk = new TalkBuilder().build();
    // When
    const createdTalk = await mongoTalkRepository.create(talk);
    // Then
    expect(createdTalk).toEqual(null);
  });
});
