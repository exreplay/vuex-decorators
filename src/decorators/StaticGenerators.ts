import { config, AverModule, stores } from './utils';
import { GetterTree, MutationTree, ActionTree } from 'vuex';

export type ConstructorOf<C> = { new (...args: any[]): C };

export interface PropertiesToDefine {
  [key: string]: PropertyDescriptor & ThisType<any>;
}

export function generateStaticNestedProperties<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine,
  parentPath?: string,
  fullPath?: string
): PropertiesToDefine {
  for (const moduleName of store.nested || []) {
    const nestedPropertiesToDefine = {};
    const nestedModule = stores[moduleName];
    const nestedObject = function () {};

    generateStaticStates(nestedModule, nestedPropertiesToDefine, fullPath);

    generateStaticGetters(
      nestedModule,
      nestedPropertiesToDefine,
      parentPath || store.moduleName
    );
    generateStaticMutations(
      nestedModule,
      nestedPropertiesToDefine,
      parentPath || store.moduleName
    );
    generateStaticActions(
      nestedModule,
      nestedPropertiesToDefine,
      parentPath || store.moduleName
    );

    if (nestedModule.nested) {
      generateStaticNestedProperties(
        nestedModule,
        nestedPropertiesToDefine,
        constructPath(
          parentPath || store.moduleName,
          moduleName,
          '',
          nestedModule.namespaced
        ),
        constructPath(parentPath || store.moduleName, moduleName, '')
      );
    }

    Object.defineProperties(nestedObject, nestedPropertiesToDefine);

    propertiesToDefine[moduleName] = {
      get() {
        return nestedObject;
      },
    };
  }

  return propertiesToDefine;
}

export function generateStaticStates<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine,
  parentModuleName?: string
): PropertiesToDefine {
  for (const state of Object.keys((store.state as () => S)())) {
    const statePath = constructPath(parentModuleName, store.moduleName, '');
    propertiesToDefine[state] = {
      get() {
        let lastModule = config.store?.state;
        const paths = statePath.split('/');
        for (const path of paths || []) lastModule = lastModule[path];
        return lastModule[state];
      },
    };
  }

  return propertiesToDefine;
}

export function generateStaticGetters<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine,
  parentModuleName?: string
): PropertiesToDefine {
  for (const getter of Object.keys(store.getters as GetterTree<S, R>)) {
    propertiesToDefine[getter] = {
      get() {
        return config.store?.getters[
          constructPath(
            parentModuleName,
            store.moduleName,
            getter,
            store.namespaced
          )
        ];
      },
    };
  }

  return propertiesToDefine;
}

export function generateStaticMutations<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine,
  parentModuleName?: string
): PropertiesToDefine {
  for (const mutation of Object.keys(store.mutations as MutationTree<S>)) {
    if (propertiesToDefine[mutation]) {
      const temp = propertiesToDefine[mutation];
      propertiesToDefine[mutation] = {
        ...temp,
        set: (val: any) => {
          config.store?.commit(
            constructPath(
              parentModuleName,
              store.moduleName,
              mutation,
              store.namespaced
            ),
            val
          );
        },
      };
    } else {
      propertiesToDefine[mutation] = {
        value: (val: any) => {
          config.store?.commit(
            `${parentModuleName ? `${parentModuleName}/` : ''}${
              store.moduleName
            }/${mutation}`,
            val
          );
        },
      };
    }
  }

  return propertiesToDefine;
}

export function generateStaticActions<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine,
  parentModuleName?: string
): PropertiesToDefine {
  for (const action of Object.keys(store.actions as ActionTree<S, R>)) {
    propertiesToDefine[action] = {
      value: async (val: any) => {
        return config.store?.dispatch(
          `${parentModuleName ? `${parentModuleName}/` : ''}${
            store.moduleName
          }/${action}`,
          val
        );
      },
    };
  }

  return propertiesToDefine;
}

export function getModule<S>(module: ConstructorOf<S>): S {
  return module as any;
}

function constructPath(
  parentModuleName: string | undefined,
  moduleName: string = '',
  propName: string,
  namespaced: boolean = true
) {
  let path = '';

  if (parentModuleName && namespaced) {
    path = `${parentModuleName}/${moduleName}${propName ? '/' : ''}${propName}`;
  } else if (parentModuleName && !namespaced) {
    path = `${parentModuleName}${propName ? '/' : ''}${propName}`;
  } else {
    path = `${moduleName}${propName ? '/' : ''}${propName}`;
  }

  return path;
}
