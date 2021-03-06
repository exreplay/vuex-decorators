import ExportVuexStore from './ExportVuexStore';
import { stores, getClassName } from './utils';
import { ActionContext } from 'vuex';
import {
  generateStaticStates,
  generateStaticGetters,
  generateStaticMutations,
  generateStaticActions,
  generateStaticNestedProperties,
} from './StaticGenerators';
import { VuexClassOptions, VuexModuleClass } from '../types';
import { assignStates } from './helpers';

function generateVuexClass<S, R>(options: VuexClassOptions) {
  return <TFunction extends VuexModuleClass<S, R>>(
    constructor: TFunction
  ): TFunction | void => {
    assignStates(constructor);

    const store = stores[getClassName(constructor)]!;

    for (const obj of options.extend || []) {
      const extendStore = ExportVuexStore<any, any, typeof constructor>(obj);
      const oldState = store.state();
      const newState = extendStore.state();
      const stateFactory = () => Object.assign(oldState, newState);
      store.state = stateFactory;
      Object.assign(store.getters, extendStore.getters);
      Object.assign(store.actions, extendStore.actions);
      Object.assign(store.mutations, extendStore.mutations);
    }

    if (options.persistent) store.persistent = options.persistent;
    else store.persistent = false;

    if (typeof options.namespaced !== 'undefined') {
      store.namespaced = options.namespaced;
    }

    /**
     * Define a method which generates all the static properties. This is necessary because
     * otherwise all the properties for nested modules would be generated which should be done
     * by the parent module to have the right module path.
     */
    Object.defineProperty(constructor, '_genStatic', {
      value: () => {
        if ((constructor as any)._statics) return;

        const propertiesToDefine = {};

        generateStaticNestedProperties(store, propertiesToDefine);
        generateStaticStates(store, propertiesToDefine);
        generateStaticGetters(store, propertiesToDefine);

        const getters = { ...propertiesToDefine };

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
          value: Object.defineProperties(
            {
              $store: {},
            },
            getters
          ),
        });
        Object.defineProperty(constructor, '_statics', {
          value: Object.defineProperties(
            {
              $store: {},
            },
            propertiesToDefine
          ),
        });
      },
    });

    return constructor;
  };
}

export class VuexModule<S = ThisType<any>, R = any> {
  $store!: ActionContext<S, R>;
}

export function VuexClass<S, R>(
  module: VuexModuleClass<S, R> & VuexClassOptions
): void;
export function VuexClass(options: VuexClassOptions): ClassDecorator;

export function VuexClass<S, R>(
  options: VuexClassOptions | (VuexModuleClass<S, R> & VuexClassOptions)
) {
  if (typeof (options as any) === 'function') {
    generateVuexClass({})(options as VuexModuleClass<S, R> & VuexClassOptions);
  } else {
    return generateVuexClass(options);
  }
}
