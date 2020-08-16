import { stores, initStore, getClassName } from './utils';
import { VuexModuleTarget } from '../types';

export default function HasGetter<
  T extends VuexModuleTarget<S, R>,
  S extends { [index: string]: any },
  R
>(target: T, key: string | symbol) {
  initStore(target);

  stores[getClassName(target)]!.getters![key as string] = (state: S) =>
    state[key as string];
}
