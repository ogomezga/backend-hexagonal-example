import { AwilixContainer, createContainer } from 'awilix';
import { TalkRepositoryInterface } from '../../domain/repositories/talk-repository';
import { asSingletonFunction, RegistrationMap } from '../dependency-injection';
// import makeCacheMemoryTalkRepository from './talk-repository/cache-mermory-talk-repository';
import makeMongoTalkRepository from './talk-repository/mongo-talk-repository';

let container: AwilixContainer;

export function getRepositoryContainer() {
  if (!container) {
    container = createContainer();

    container.register({
      talkRepository: asSingletonFunction(makeMongoTalkRepository),
    } as RegistrationMap<RepositoryDependencies>);
  }
  return container;
}

export interface RepositoryDependencies {
  talkRepository: TalkRepositoryInterface;
}
