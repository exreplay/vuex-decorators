import { Config, Store, VuexModuleTarget } from '../types';

export const config: Config<any> = {};

export const stores: Store<any, any, any> = {};

export function getStates<T extends VuexModuleTarget<S, R>, S, R>(
  target: T,
  props: string[]
) {
  const s: { [key: string]: any } = {};
  for (const prop of props) {
    s[prop] = target[prop];
  }
  return s;
}

export function initStore<T extends VuexModuleTarget<S, R>, S, R>(
  target: T
): void {
  if (typeof stores[getClassName(target)] === 'undefined') {
    stores[getClassName(target)] = {
      namespaced: true,
      state: () => {
        return {};
      },
      nested: [],
      getters: {},
      actions: {},
      mutations: {},
      modules: {},
    };
  }
}

export function getClassName(Obj: any): string {
  let target = new Obj.constructor();
  if (typeof target === 'function') target = new Obj();
  return target.moduleName;
}
