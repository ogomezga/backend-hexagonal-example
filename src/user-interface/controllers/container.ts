import {AwilixContainer, createContainer} from 'awilix';
import {asSingletonFunction, RegistrationMap} from '../../infrastructure/dependency-injection';

import makeTalksController from './talks-controller';
import talksController from './talks-controller';
import makeMainController from './main-controller';
import mainController from './main-controller';

let container: AwilixContainer;

export function getControllerContainer() {
  if (!container) {
    container = createContainer();
    container.register({
      talksController: asSingletonFunction(makeTalksController),
      mainController: asSingletonFunction(makeMainController),
    } as RegistrationMap<ControllerDependencies>);
  }
  return container;
}

export interface ControllerDependencies {
  talksController: ReturnType<typeof talksController>;
  mainController: ReturnType<typeof mainController>;
}
