import { stores, getClassName, AverModule } from './utils';

function mapGetterFns<S, R>(store: AverModule<S, R>) {
  store.getters = {
    ...store.getters,
    ...store._getterFns,
  };
}

function nestStore(name: string) {
  const store = { ...stores[name] };

  mapGetterFns(store);

  for (const { moduleName } of store.nested) {
    const nestedModule = stores[moduleName];
    store.modules![moduleName] = nestedModule;
    if (nestedModule.nested.length > 0) nestStore(moduleName);
  }

  return store;
}

export default function ExportVuexStore<S, R, T>(
  target: T,
  exportAsReadyObject = false
): AverModule<S, R> | { [key: string]: AverModule<S, R> } {
  const name = getClassName(target);
  const store = nestStore(name);

  if (!exportAsReadyObject) return store;
  else return { [name]: store };
}
