import { Store as VuexStore, Module, GetterTree, MutationTree } from 'vuex';

interface NestedModule<N> {
  prop: string;
  moduleName: string;
  module: N;
}

export interface AverModule<S, R, N> extends Module<S, R> {
  moduleName?: string;
  persistent?: string[] | boolean;
  nested: NestedModule<N>[];
  _getterFns?: GetterTree<S, R>;
}

interface Store<S, R, N> {
  [key: string]: AverModule<S, R, N>;
}

interface Config<S> {
  store?: VuexStore<S>;
}

export const config: Config<any> = {};

export const stores: Store<any, any, any> = {};

export function assignStates<S>(Obj: any) {
  const target = new Obj();
  let props = Object.getOwnPropertyNames(target);
  if (typeof target.moduleName === 'undefined') {
    console.error(
      `You need to define the 'moduleName' class variable inside '${target.constructor.name}'! Otherwise it won't be added to the Vuex Store!`
    );
  }

  initStore(target);

  /**
   * We need to remove all props which have a moduleName and therefore are instances of a nested module.
   * If we dont do that, every nested prop would be also declared as state and vuex throws a warning.
   */
  props = props.filter((prop) => !target[prop]?.moduleName);

  stores[getClassName(target)].moduleName = target.moduleName;
  props.splice(props.indexOf('moduleName'), 1);

  const stateFactory = () => getStates(target, props);
  stores[getClassName(target)].state = stateFactory;

  const proto = Object.getPrototypeOf(target);
  const functions = Object.getOwnPropertyNames(proto);

  const getters = {} as GetterTree<S, any>;
  const mutations = {} as MutationTree<S>;

  for (const func of functions) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, func);
    if (descriptor && descriptor.get) {
      getters[func] = (
        state: S,
        getters: GetterTree<S, any>,
        rootState: any,
        rootGetters: GetterTree<any, any>
      ) => {
        Obj.$store = { state, getters, rootState, rootGetters };
        const output = (descriptor.get as Function).call(Obj._staticGetters);
        return output;
      };
    }
    if (descriptor && descriptor.set) {
      mutations[func] = (state: S, payload: any) => {
        (descriptor.set as Function).call(state, payload);
      };
    }
  }

  Object.assign(stores[getClassName(target)].getters, getters);
  Object.assign(stores[getClassName(target)].mutations, mutations);
}

export function getStates<T>(target: T, props: string[]) {
  const s: { [key: string]: any } = {};
  for (const prop of props) {
    s[prop] = (target as any)[prop];
  }
  return s;
}

export function initStore<T>(target: T): void {
  // tslint:disable-next-line: strict-type-predicates
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
