import { Getter } from 'vuex';
import { stores, initStore, getClassName } from './utils';

export default function Getter<T, R>(
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => R>
) {
  initStore(target);
  const store = stores[getClassName(target)];

  if (!store._getterFns) store._getterFns = {};

  store._getterFns[key as string] = <S, R>(
    state: S,
    getters: any,
    rootState: R,
    rootGetters: any
  ) => {
    const targetModule = (target as any).constructor;
    targetModule._staticGetters.$store = {
      state,
      getters,
      rootState,
      rootGetters,
    };
    const output = (target as any)[key].call(targetModule._staticGetters);
    return output;
  };
}
