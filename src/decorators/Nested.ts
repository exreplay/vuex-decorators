import { initStore, getClassName, stores } from './utils';

export default function Nested<T>(target: T, key: string | symbol) {
  initStore(target);
  const obj = new (target as any).constructor();
  stores[getClassName(target)].nested!.push({
    prop: key.toString(),
    moduleName: obj[key].moduleName,
  });
}
