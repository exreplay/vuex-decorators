import { stores, getClassName, AverModule } from './utils';

function nestStore(name: string) {
  const store = stores[name];

  for (const moduleName of store.nested || []) {
    const nestedModule = stores[moduleName];
    store.modules![moduleName] = nestedModule;
    if (nestedModule.nested) nestStore(moduleName);
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
