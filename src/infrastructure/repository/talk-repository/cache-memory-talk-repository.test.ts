import { TalkBuilder } from '../../../test/test-helpers/builders/talk-builder';
import makeCacheMemoryTalkRepository from './cache-mermory-talk-repository';
import { TalkRepositoryInterface } from '../../../domain/repositories/talk-repository';

describe.skip('cacheMemoryTalkRepository', () => {
  let cacheMemoryTalkRepository: TalkRepositoryInterface;

  beforeEach(async () => {
    cacheMemoryTalkRepository = makeCacheMemoryTalkRepository();
  });

  it('Should schedule a talk', async () => {
    expect((await cacheMemoryTalkRepository.findAll()).length).toEqual(0);
    const talk = new TalkBuilder().build();
    const createdTalk = await cacheMemoryTalkRepository.create(talk);
    expect((await cacheMemoryTalkRepository.findAll()).length).toEqual(1);
    expect(createdTalk).toEqual(talk);
  });

  test('Should retreive talks', async () => {
    const talk1 = new TalkBuilder().build();
    const talk2 = new TalkBuilder().build();
    await cacheMemoryTalkRepository.create(talk1);
    await cacheMemoryTalkRepository.create(talk2);
    expect((await cacheMemoryTalkRepository.findAll()).length).toEqual(2);
    const talks = await cacheMemoryTalkRepository.findAll();
    expect(talks).toHaveLength(2);
    expect(talks).toEqual([talk1, talk2]);
  });
});
