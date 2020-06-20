import { stores, getClassName, AverModule } from './utils';

function mapGetterFns<S, R, N>(store: AverModule<S, R, N>) {
  store.getters = {
    ...store.getters,
    ...store._getterFns,
  };
}

function nestStore(name: string) {
  const store = { ...stores[name] };

  mapGetterFns(store);

  for (const { moduleName } of store.nested) {
    const nestedModule = { ...stores[moduleName] };
    mapGetterFns(nestedModule);
    store.modules![moduleName] = nestedModule;
    if (nestedModule.nested.length > 0) nestStore(moduleName);
  }

  return store;
}

export default function ExportVuexStore<S, R, T, N>(
  target: T,
  exportAsReadyObject = false
): AverModule<S, R, N> | { [key: string]: AverModule<S, R, N> } {
  const targetModule = target as any;
  if (!targetModule._statics) targetModule._genStatic();

  const name = getClassName(target);
  const store = nestStore(name);

  if (!exportAsReadyObject) return store;
  else return { [name]: store };
}
