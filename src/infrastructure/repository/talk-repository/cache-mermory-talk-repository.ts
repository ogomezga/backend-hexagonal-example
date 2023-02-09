import { Talk } from '../../../domain/entities/talk';
import { TalkRepositoryInterface } from '../../../domain/repositories/talk-repository';

export default function makeCacheMemoryTalkRepository(): TalkRepositoryInterface {
  const talks: Talk[] = new Array();
  return {
    async findAll() {
      return talks;
    },
    async create(talk: Talk): Promise<Talk> {
      talks.push(talk);
      return talk;
    },
  };
}
