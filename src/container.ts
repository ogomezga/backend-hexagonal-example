import {AwilixContainer, createContainer} from 'awilix';
import { getInfrastructureContainer, InfrastructureDependencies } from './infrastructure/container';
import {asSingletonFunction, RegistrationMap} from './infrastructure/dependency-injection';
import makeServerFactory, { ServerFactory } from './user-interface/server-factory';
import { getRouterContainer, RouterDependencies } from './user-interface/routers/container';
import { getUseCaseContainer, UseCaseDependencies } from './domain/usescases/container';
import { ControllerDependencies, getControllerContainer } from './user-interface/controllers/container';

let container: AwilixContainer;

export function getMainContainer() {
  if (!container) {
    container = createContainer();
    container.register({
      serverFactory: asSingletonFunction(makeServerFactory),
    } as RegistrationMap<LocalDependencies>);
    container.register(getInfrastructureContainer().registrations);
    container.register(getUseCaseContainer().registrations);
    container.register(getControllerContainer().registrations);
    container.register(getRouterContainer().registrations);
  }
  return container;
}

type LocalDependencies =  {
  serverFactory: ServerFactory;
};

export type Dependencies = LocalDependencies & InfrastructureDependencies &
  RouterDependencies &
  UseCaseDependencies &
  ControllerDependencies;
