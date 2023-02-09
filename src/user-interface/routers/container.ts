import {AwilixContainer, createContainer} from 'awilix';
import {asSingletonFunction, RegistrationMap} from '../../infrastructure/dependency-injection';
import makeTalkRouter from './talks-router';
import makeMainRouter from './main-router';


let container: AwilixContainer;

export function getRouterContainer() {
  if (!container) {
    container = createContainer();
    container.register({
      talkRouter: asSingletonFunction(makeTalkRouter),
      mainRouter: asSingletonFunction(makeMainRouter),
    } as RegistrationMap<RouterDependencies>);
  }
  return container;
}

export interface RouterDependencies {
  talkRouter: ReturnType<typeof makeTalkRouter>;
  mainRouter: ReturnType<typeof makeMainRouter>;
}
