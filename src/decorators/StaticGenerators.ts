import { config, AverModule, stores } from './utils';
import { GetterTree, MutationTree, ActionTree } from 'vuex';

export type ConstructorOf<C> = { new (...args: any[]): C };

export interface PropertiesToDefine {
  [key: string]: PropertyDescriptor & ThisType<any>;
}

/**
 * Generate static properties for nested modules
 *
 * @param store The current module which should be processed
 * @param propertiesToDefine The object which gets defined on the constructor
 * @param parentPath The path of the parent module to help construct nested paths
 * @param fullPath The full path of the nesting
 */
export function generateStaticNestedProperties<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine,
  parentPath?: string,
  fullPath?: string
): PropertiesToDefine {
  for (const moduleName of store.nested || []) {
    const nestedPropertiesToDefine = {};
    const nestedModule = stores[moduleName];
    // tslint:disable-next-line: no-empty
    const nestedObject = function () {};

    // We need to pass the full path to states because they, no matter if namespace true or false, always need the full path.
    generateStaticStates(
      nestedModule,
      nestedPropertiesToDefine,
      fullPath || store.moduleName
    );

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

/**
 * Generate static states for the root module
 *
 * @param store The current module which should be processed
 * @param propertiesToDefine The object which gets defined on the constructor
 * @param parentModuleName The path of the parent module
 */
export function generateStaticStates<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine,
  parentModuleName: string = ''
): PropertiesToDefine {
  for (const state of Object.keys((store.state as () => S)())) {
    const statePath = constructPath(parentModuleName, store.moduleName, state);
    propertiesToDefine[state] = {
      get() {
        let lastModule = config.store?.state;
        const paths = statePath.split('/');
        for (const path of paths || []) lastModule = lastModule[path];
        return lastModule;
      },
    };
  }

  return propertiesToDefine;
}

/**
 * Generate static getters for the root module
 *
 * @param store The current module which should be processed
 * @param propertiesToDefine The object which gets defined on the constructor
 * @param parentModuleName The path of the parent module
 */
export function generateStaticGetters<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine,
  parentModuleName: string = ''
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

/**
 * Generate static mutations for the root module
 *
 * @param store The current module which should be processed
 * @param propertiesToDefine The object which gets defined on the constructor
 * @param parentModuleName The path of the parent module
 */
export function generateStaticMutations<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine,
  parentModuleName: string = ''
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
    }
  }

  return propertiesToDefine;
}

/**
 * Generate static actions for the root module
 *
 * @param store The current module which should be processed
 * @param propertiesToDefine The object which gets defined on the constructor
 * @param parentModuleName The path of the parent module
 */
export function generateStaticActions<S, R>(
  store: AverModule<S, R>,
  propertiesToDefine: PropertiesToDefine,
  parentModuleName: string = ''
): PropertiesToDefine {
  for (const action of Object.keys(store.actions as ActionTree<S, R>)) {
    propertiesToDefine[action] = {
      value: async (val: any) => {
        return config.store?.dispatch(
          constructPath(
            parentModuleName,
            store.moduleName,
            action,
            store.namespaced
          ),
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

/**
 * Construct the path for the current module
 *
 * @param parentModuleName The name of the parent module
 * @param moduleName The name of the current module
 * @param propName The name of the property eg. getter, mutation, ...
 * @param namespaced Make the path namespace aware
 */
export function constructPath(
  parentModuleName: string = '',
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
