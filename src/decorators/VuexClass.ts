import ExportVuexStore from './ExportVuexStore';
import { stores, assignStates, getClassName } from './utils';
import { ActionContext } from 'vuex';

interface VuexClassOptions {
  persistent?: Array<string>;
  extend?: Array<any>;
}

export class VuexModule<S = ThisType<any>, R = any> {
  $store!: ActionContext<S, R>;
}

export function VuexClass<S>(module?: Function & VuexClassOptions): void;
export function VuexClass<S>(options?: VuexClassOptions): ClassDecorator;

export function VuexClass<S>(
  options?: VuexClassOptions | (Function & VuexClassOptions)
) {
  if (typeof (options as any) === 'function') {
    assignStates(options);
  } else {
    return (target: S) => {
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
    };
  }
}
