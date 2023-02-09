import { Dependencies } from '../../container';
import { ObjectStub } from '../../test/test-helpers/object-stub';
import makeListAllTalks from './list-all-talks';
import { TalkBuilder } from '../../test/test-helpers/builders/talk-builder';
import { Talk } from '../entities/talk';

import { v4 as uuidv4 } from 'uuid';

describe('listAllTalks', () => {
  const stubs = {
    talkRepository: {
      findAll: jest.fn(),
    } as ObjectStub<Dependencies['talkRepository']>,
  };
  const listAllTalks = makeListAllTalks(stubs);
  let scheduledMockedTalks: Talk[];

  beforeEach(() => {
    scheduledMockedTalks = [];
    stubs.talkRepository.findAll.mockResolvedValue(scheduledMockedTalks);
  });

  function givenSomeTalks(talksSettings: { id?: string }[]): Talk[] {
    scheduledMockedTalks = talksSettings.map(({ id = uuidv4() }) => new TalkBuilder().with('id', id).build());
    stubs.talkRepository.findAll.mockResolvedValue(scheduledMockedTalks);
    return scheduledMockedTalks;
  }

  test('Given a list of talks should return a list of all scheduled talks', async () => {
    // Given
    givenSomeTalks([{ id: 'any-talk-id' }]);
    // When
    const talksToBeListed = await listAllTalks();
    // Then
    expect(stubs.talkRepository.findAll).toBeCalledTimes(1);
    expect(talksToBeListed).toEqual(scheduledMockedTalks);
  });

  test('Given an empty list should return a empty list', async () => {
    // When
    const talksToBeListed = await listAllTalks();
    // Then
    expect(stubs.talkRepository.findAll).toBeCalledTimes(1);
    expect(talksToBeListed).toEqual(scheduledMockedTalks);
  });
});
