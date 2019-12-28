import { stores, initStore, getClassName } from './utils';

export default function Mutation(target, key, descriptor) {
  initStore(target);
  stores[getClassName(target)].mutations[key] = (state, payload) => {
    target[key].call(state, payload);
  };
}
