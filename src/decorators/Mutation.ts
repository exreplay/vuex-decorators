import { stores, initStore, getClassName } from './utils';
import { VuexModuleTarget } from '../types';

export default function Mutation<T extends VuexModuleTarget<S, R>, S, R>(
  target: T,
  key: string | symbol
) {
  initStore(target);

  stores[getClassName(target)]!.mutations![key as string] = <S, R>(
    state: S,
    payload: R
  ) => {
    target[key as string].call(state, payload);
  };
}
