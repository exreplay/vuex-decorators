import ExportVuexStore from './ExportVuexStore';
import { stores, assignStates, getClassName } from './utils';
import { ActionContext } from 'vuex';
import {
  generateStaticStates,
  generateStaticGetters,
  generateStaticMutations,
  generateStaticActions,
  generateStaticNestedProperties,
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
    assignStates(constructor);

    const store = stores[getClassName(constructor)];

    for (const obj of options?.extend || []) {
      const extendStore = ExportVuexStore<any, any, typeof constructor>(obj);
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

    const getters = { ...propertiesToDefine };

    generateStaticNestedProperties(store, propertiesToDefine);
    generateStaticMutations(store, propertiesToDefine);
    generateStaticActions(store, propertiesToDefine);

    /**
     * Assign the cloned propertiesToDefine object from above to a _staticGetters property.
     * This is needed later for binding the `this` context of getters to only the getters and states.
     * We could also bind all properties but this is not how vuex should be used in a non class based way.
     *
     * This is also way more performant than extracting the getters from the properties and defining them again
     * everytime a getter is called. By doing it this way we just pass the _staticGetters property to the
     * `this` context and that is it.
     */
    Object.defineProperty(constructor, '_staticGetters', {
      value: Object.defineProperties({}, getters),
    });
    Object.defineProperty(constructor, '$store', { writable: true });
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
