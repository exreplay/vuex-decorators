import { stores, initStore, getClassName } from './utils';

export default function HasGetter(target, key, descriptor) {
  initStore(target);
  stores[getClassName(target)].getters[key] = state => state[key];
}
