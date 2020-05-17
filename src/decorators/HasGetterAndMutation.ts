import Vue from 'vue';
import { stores, initStore, getClassName } from './utils';

export default function HasGetterAndMutation<T>(
  target: T,
  key: string | symbol
) {
  initStore(target);
  stores[getClassName(target)].getters![key as string] = (state) => state[key];
  stores[getClassName(target)].mutations![key as string] = (state, val) => {
    Vue.set(state, key as string, val);
  };
}
