import { config, initStore, getClassName, stores, getStates } from './utils';
import { VuexModuleClass, NewableVuexModuleClass } from '../types';
import { GetterTree, MutationTree } from 'vuex';

export function GetterFn<S, R>(
  targetModule: VuexModuleClass<S, R>,
  getterFn: () => void
) {
  return (state: S, getters: any, rootState: R, rootGetters: any) => {
    let output;
    if (config.store && targetModule._caller) {
      targetModule[`${targetModule._caller}staticGetters`].$store = {
        state,
        getters,
        rootState,
        rootGetters,
      };
      output = getterFn.call(
        targetModule[`${targetModule._caller}staticGetters`]
      );
    } else if (config.store && targetModule._staticGetters) {
      targetModule._staticGetters.$store = {
        state,
        getters,
        rootState,
        rootGetters,
      };
      output = getterFn.call(targetModule._staticGetters);
    } else {
      const thisObject = { $store: { state, getters, rootState, rootGetters } };
      for (const key of Object.keys(state)) {
        Object.assign(thisObject, { [key]: (state as any)[key] });
      }
      output = getterFn.call(thisObject);
    }
    return output;
  };
}

export function assignStates<S, R>(Obj: VuexModuleClass<S, R>) {
  const target = new (Obj as NewableVuexModuleClass<S, R>)();
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
  const store = stores[getClassName(target)]!;

  store.moduleName = target.moduleName;
  props.splice(props.indexOf('moduleName'), 1);

  const stateFactory = () => getStates(target, props);
  store.state = stateFactory;

  const proto = Object.getPrototypeOf(target);
  const functions = Object.getOwnPropertyNames(proto);

  const getters = {} as GetterTree<S, any>;
  const mutations = {} as MutationTree<S>;

  for (const func of functions) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, func);
    if (descriptor && descriptor.get) {
      getters[func] = GetterFn(Obj, descriptor.get);
    }
    if (descriptor && descriptor.set) {
      mutations[func] = (state: S, payload: any) => {
        (descriptor.set as Function).call(state, payload);
      };
    }
  }

  Object.assign(store.getters, getters);
  Object.assign(store.mutations, mutations);
}
