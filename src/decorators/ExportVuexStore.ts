import { stores, getClassName } from './utils';
import { VuexModuleClass, AverModule } from '../types';

function mapGetterFns<S, R, N>(store: AverModule<S, R, N>) {
  store.getters = {
    ...store.getters,
    ...store._getterFns,
  };
}

function nestStore(name: string) {
  if (!stores[name]) return { nested: [] };
  const store = { ...stores[name]! };

  mapGetterFns(store);

  for (const { moduleName } of store.nested) {
    if (stores[moduleName]) {
      const nestedModule = { ...stores[moduleName]! };
      mapGetterFns(nestedModule);
      store.modules![moduleName] = nestedModule;
      if (nestedModule.nested.length > 0) nestStore(moduleName);
    }
  }

  return store;
}

export default function ExportVuexStore<
  S,
  R,
  T extends VuexModuleClass<S, R>,
  N
>(
  target: T,
  exportAsReadyObject = false
): AverModule<S, R, N> | { [key: string]: AverModule<S, R, N> } {
  if (!target._statics && target._genStatic) target._genStatic();

  const name = getClassName(target);
  const store = nestStore(name);

  if (!exportAsReadyObject) return store;
  else return { [name]: store };
}
