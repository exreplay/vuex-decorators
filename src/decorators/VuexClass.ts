import ExportVuexStore from './ExportVuexStore';
import { stores, assignStates, getClassName } from './utils';
import { ActionContext } from 'vuex';
import {
  generateStaticStates,
  generateStaticGetters,
  generateStaticMutations,
  generateStaticActions,
} from './StaticGenerators';

interface VuexClassOptions {
  persistent?: Array<string>;
  extend?: Array<any>;
  namespaced?: boolean;
}

function generateVuexClass<S, R>(options: VuexClassOptions) {
  return <TFunction extends Function>(
    constructor: TFunction
  ): TFunction | void => {
    const target: Function & VuexClassOptions = constructor;

    assignStates(target);

    const store = stores[getClassName(target)];

    for (const obj of options?.extend || []) {
      const extendStore = ExportVuexStore<any, any, typeof target>(obj);
      const oldState = store.state();
      const newState = extendStore.state();
      const stateFactory = () => Object.assign(oldState, newState);
      store.state = stateFactory;
      Object.assign(store.getters, extendStore.getters);
      Object.assign(store.actions, extendStore.actions);
      Object.assign(store.mutations, extendStore.mutations);
    }

    if (options?.persistent) store.persistent = options.persistent;
    else store.persistent = false;

    if (typeof options?.namespaced !== 'undefined') {
      store.namespaced = options.namespaced;
    }

    const propertiesToDefine = {};

    generateStaticStates(store, propertiesToDefine);
    generateStaticGetters(store, propertiesToDefine);
    generateStaticMutations(store, propertiesToDefine);
    generateStaticActions(store, propertiesToDefine);

    Object.defineProperties(constructor, propertiesToDefine);

    return constructor;
  };
}

export class VuexModule<S = ThisType<any>, R = any> {
  $store!: ActionContext<S, R>;
}

export function VuexClass(module: Function & VuexClassOptions): void;
export function VuexClass(options: VuexClassOptions): ClassDecorator;

export function VuexClass(
  options: VuexClassOptions | (Function & VuexClassOptions)
) {
  if (typeof (options as any) === 'function') {
    generateVuexClass({})(options as Function & VuexClassOptions);
  } else {
    return generateVuexClass(options);
  }
}
