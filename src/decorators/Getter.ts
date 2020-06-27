import { Getter } from 'vuex';
import { stores, initStore, getClassName, config } from './utils';

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
    let output;
    const targetModule = (target as any).constructor;
    if (config.store && targetModule._caller) {
      targetModule[`${targetModule._caller}staticGetters`].$store = {
        state,
        getters,
        rootState,
        rootGetters,
      };
      output = (target as any)[key].call(
        targetModule[`${targetModule._caller}staticGetters`]
      );
    } else if (config.store && targetModule._staticGetters) {
      targetModule._staticGetters.$store = {
        state,
        getters,
        rootState,
        rootGetters,
      };
      output = (target as any)[key].call(targetModule._staticGetters);
    } else {
      const thisObject = { $store: { state, getters, rootState, rootGetters } };
      for (const key of Object.keys(state)) {
        Object.assign(thisObject, { [key]: (state as any)[key] });
      }
      output = (target as any)[key].call(thisObject);
    }
    return output;
  };
}
