import * as awilix from 'awilix';
import {asFunction, asValue, AwilixContainer} from 'awilix';
import { Dependencies, getMainContainer } from '../container';

export function resolveDependency<T extends keyof Dependencies>(key: T, inputContainer?: AwilixContainer): Dependencies[T] {
  if (!inputContainer) {
    inputContainer = getMainContainer();
  }
  return inputContainer.resolve(key);
}

export function registerDependencies(dependencies: { [key in keyof Dependencies]?: any }, inputContainer?: AwilixContainer) {
  if (!inputContainer) {
    inputContainer = getMainContainer();
  }
  for (const key in dependencies) {
    inputContainer.register(key, asValue(dependencies[key]));
  }
}

export const asSingletonFunction = (fn: (...args: any[]) => any) => {
  return asFunction(fn, {lifetime: 'SINGLETON'});
};

export type RegistrationMap<Dependencies> = {[key in keyof Dependencies]: awilix.Resolver<any>};