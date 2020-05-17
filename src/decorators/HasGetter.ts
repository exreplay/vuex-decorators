import { stores, initStore, getClassName } from './utils';

export default function HasGetter<T>(target: T, key: string | symbol) {
  initStore(target);
  stores[getClassName(target)].getters![key as string] = (state: any) =>
    state[key];
}
