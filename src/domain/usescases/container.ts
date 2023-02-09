import { AwilixContainer, createContainer } from 'awilix';
import {asSingletonFunction, RegistrationMap} from '../../infrastructure/dependency-injection';

import makeListAllTalks from './list-all-talks';
import listAllTalks from './list-all-talks';
import makeScheduleTalk from './schedule-talk';
import scheduleTalk from './schedule-talk';

let container: AwilixContainer;

export function getUseCaseContainer() {
  if (!container) {
    container = createContainer();
    container.register({
      listAllTalks: asSingletonFunction(makeListAllTalks),
      scheduleTalk: asSingletonFunction(makeScheduleTalk),
    } as RegistrationMap<UseCaseDependencies>);
  }
  return container;
}

export type UseCaseDependencies = {
  listAllTalks: ReturnType<typeof listAllTalks>;
  scheduleTalk: ReturnType<typeof scheduleTalk>;
};
