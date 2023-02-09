import { Dependencies } from '../../container';
import { ObjectStub } from '../../test/test-helpers/object-stub';
import makeScheduleTalk from './schedule-talk';
import { TalkBuilder } from '../../test/test-helpers/builders/talk-builder';
import { Talk } from '../entities/talk';
import { TitleTalkBusinessConflictError } from '../exceptions/title-talk-business-conflict';

describe('scheduleTalk', () => {
  const stubs = {
    talkRepository: {
      findAll: jest.fn(),
      create: jest.fn(),
    } as ObjectStub<Dependencies['talkRepository']>,
  };

  const scheduleTalk = makeScheduleTalk(stubs);
  let existingTalk: Talk;
  let receivedTalk: Talk;
  let scheduledMockedTalk: Talk;

  beforeEach(async () => {
    scheduledMockedTalk = new TalkBuilder().build();
    existingTalk = new TalkBuilder().build();
    stubs.talkRepository.findAll.mockResolvedValue([existingTalk]);
    stubs.talkRepository.create.mockResolvedValue(scheduledMockedTalk);
  });

  function givenSomeTalks(talksSettings: { startHour?: string; endHour?: string }[]): Talk[] {
    const scheduledMockedTalks = talksSettings.map(({ startHour, endHour }) =>
      new TalkBuilder().with('startHour', startHour).with('endHour', endHour).build(),
    );
    stubs.talkRepository.findAll.mockResolvedValue(scheduledMockedTalks);
    return scheduledMockedTalks;
  }

  test('Given an empty list of talks should return the result of the addition of a new scheduled talk in an empty room', async () => {
    // Given
    receivedTalk = new TalkBuilder()
      .with('id', '')
      .with('title', 'schedule a talk in an empty room')
      .with('startHour', '')
      .with('endHour', '')
      .with('room', '')
      .build();
    stubs.talkRepository.findAll.mockResolvedValue([]);
    // When
    const scheduledTalk = await scheduleTalk(receivedTalk);
    // Then
    expect(stubs.talkRepository.create).toBeCalledTimes(1);
    expect(stubs.talkRepository.create).toBeCalledWith(receivedTalk);
    expect(scheduledTalk).toEqual(scheduledMockedTalk);
  });

  test('Given an empty list of talks should return the result of the addition of a new scheduled talk with a title in use', async () => {
    // Given
    receivedTalk = new TalkBuilder().build();
    // When - await scheduleTalk(receivedTalk);
    // Then
    await expect(scheduleTalk(receivedTalk)).rejects.toThrow(TitleTalkBusinessConflictError);
  });

  test('Given a list with some talks already scheduled should return the result of the addition of a new scheduled talk to a room that has a free slot', async () => {
    // Given
    receivedTalk = new TalkBuilder()
      .with('id', '')
      .with('title', 'schedule a talk to a room that has a free slot')
      .with('duration', 45)
      .with('startHour', '')
      .with('endHour', '')
      .with('room', '')
      .build();
    scheduledMockedTalk = new TalkBuilder().with('startHour', '10:00').with('endHour', '10:45').build();
    stubs.talkRepository.create.mockResolvedValue(scheduledMockedTalk);
    // When
    const scheduledTalk = await scheduleTalk(receivedTalk);
    // Then
    expect(stubs.talkRepository.create).toBeCalledTimes(1);
    expect(stubs.talkRepository.create).toBeCalledWith(receivedTalk);
    expect(scheduledTalk).toEqual(scheduledMockedTalk);
  });

  test('Given a list with slots for scheduling talks should return the result of the addition of a new scheduled talk to a one-hour room', async () => {
    // Given
    scheduledMockedTalk = new TalkBuilder()
      .with('title', 'schedule a talk to a one-hour room')
      .with('startHour', '10:00')
      .with('endHour', '11:00')
      .build();
    receivedTalk = new TalkBuilder()
      .with('id', '')
      .with('title', 'schedule a talk to a one-hour room')
      .with('startHour', '')
      .with('endHour', '')
      .with('room', '')
      .build();
    stubs.talkRepository.create.mockResolvedValue(scheduledMockedTalk);
    // Then
    const scheduledTalk = await scheduleTalk(receivedTalk);
    // When
    expect(stubs.talkRepository.create).toBeCalledTimes(1);
    expect(stubs.talkRepository.create).toBeCalledWith(receivedTalk);
    expect(scheduledTalk).toEqual(scheduledMockedTalk);
  });

  test('Given a list with some talks already scheduled should return the result of the addition of a new scheduled talk in a room with 15-minute slot', async () => {
    // Given
    receivedTalk = new TalkBuilder()
      .with('title', 'schedule a talk in a room with 15-minute slot')
      .with('id', '')
      .with('duration', 15)
      .with('startHour', '')
      .with('endHour', '')
      .with('room', '')
      .build();
    givenSomeTalks([
      { startHour: '10:00', endHour: '11:00' },
      { startHour: '11:00', endHour: '12:00' },
      { startHour: '12:00', endHour: '13:00' },
      { startHour: '13:00', endHour: '14:00' },
      { startHour: '14:00', endHour: '15:00' },
      { startHour: '15:00', endHour: '16:00' },
      { startHour: '16:00', endHour: '17:00' },
      { startHour: '17:00', endHour: '17:45' },
    ]);
    // When
    const scheduledTalk = await scheduleTalk(receivedTalk);
    // Then
    expect(stubs.talkRepository.create).toBeCalledTimes(1);
    expect(stubs.talkRepository.create).toBeCalledWith(receivedTalk);
    expect(scheduledTalk).toEqual(scheduledMockedTalk);
  });

  test('should return the result of the addition of a new scheduled talk in an full room', async () => {
    // Given
    scheduledMockedTalk = new TalkBuilder().with('title', 'schedule a talk in a full room').with('room', '2').build();
    receivedTalk = new TalkBuilder()
      .with('id', '')
      .with('title', 'schedule a talk in a full room')
      .with('startHour', '')
      .with('endHour', '')
      .with('room', '2')
      .build();
    stubs.talkRepository.create.mockResolvedValue(scheduledMockedTalk);
    givenSomeTalks([
      { startHour: '10:00', endHour: '11:00' },
      { startHour: '11:00', endHour: '12:00' },
      { startHour: '12:00', endHour: '13:00' },
      { startHour: '13:00', endHour: '14:00' },
      { startHour: '14:00', endHour: '15:00' },
      { startHour: '15:00', endHour: '16:00' },
      { startHour: '16:00', endHour: '17:00' },
      { startHour: '17:00', endHour: '18:00' },
    ]);
    // When
    const scheduledTalk = await scheduleTalk(receivedTalk);
    // Then
    expect(stubs.talkRepository.create).toBeCalledTimes(1);
    expect(stubs.talkRepository.create).toBeCalledWith(receivedTalk);
    expect(scheduledTalk).toEqual(scheduledMockedTalk);
  });
});
