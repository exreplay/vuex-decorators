import { config, AverModule } from './utils';
import { GetterTree, MutationTree, ActionTree } from 'vuex';

export type ConstructorOf<C> = { new (...args: any[]): C };

export interface PropertiesToDefine {
  [key: string]: PropertyDescriptor & ThisType<any>;
}

export function generateStaticStates<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine
): PropertiesToDefine {
  for (const state of Object.keys((store.state as () => S)())) {
    propertiesToDefine[state] = {
      get() {
        return config.store?.state[store.moduleName as string][state];
      },
    };
  }

  return propertiesToDefine;
}

export function generateStaticGetters<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine
): PropertiesToDefine {
  for (const getter of Object.keys(store.getters as GetterTree<S, R>)) {
    propertiesToDefine[getter] = {
      get() {
        return config.store?.getters[`${store.moduleName}/${getter}`];
      },
    };
  }

  return propertiesToDefine;
}

export function generateStaticMutations<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine
): PropertiesToDefine {
  for (const mutation of Object.keys(store.mutations as MutationTree<S>)) {
    if (propertiesToDefine[mutation]) {
      const temp = propertiesToDefine[mutation];
      propertiesToDefine[mutation] = {
        ...temp,
        set: (val: any) => {
          config.store?.commit(`${store.moduleName}/${mutation}`, val);
        },
      };
    } else {
      propertiesToDefine[mutation] = {
        value: (val: any) => {
          config.store?.commit(`${store.moduleName}/${mutation}`, val);
        },
      };
    }
  }

  return propertiesToDefine;
}

export function generateStaticActions<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine
): PropertiesToDefine {
  for (const action of Object.keys(store.actions as ActionTree<S, R>)) {
    propertiesToDefine[action] = {
      value: async (val: any) => {
        return config.store?.dispatch(`${store.moduleName}/${action}`, val);
      },
    };
  }

  return propertiesToDefine;
}

export function getModule<S>(module: ConstructorOf<S>): S {
  return module as any;
}
