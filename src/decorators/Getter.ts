import { Getter } from 'vuex';
import { stores, initStore, getClassName } from './utils';

export default function Getter<T, R>(
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => R>
) {
  initStore(target);
  stores[getClassName(target)].getters![key as string] = <S, R>(
    state: S,
    getters: any,
    rootState: R,
    rootGetters: any
  ) => {
    const thisObject = { $store: { state, getters, rootState, rootGetters } };
    for (const key of Object.keys(state)) {
      Object.assign(thisObject, { [key]: (state as any)[key] });
    }
    const output = (target as any)[key].call(thisObject);
    return output;
  };
}
