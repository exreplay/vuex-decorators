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

  const targetModule = (target as any).constructor;

  store._getterFns[key as string] = GetterFn(
    targetModule,
    (target as any)[key]
  );
}

export function GetterFn<S, R>(targetModule: any, getterFn: () => {}) {
  return (state: S, getters: any, rootState: R, rootGetters: any) => {
    let output;
    if (config.store && targetModule._caller) {
      targetModule[`${targetModule._caller}staticGetters`].$store = {
        state,
        getters,
        rootState,
        rootGetters,
      };
      output = getterFn.call(
        targetModule[`${targetModule._caller}staticGetters`]
      );
    } else if (config.store && targetModule._staticGetters) {
      targetModule._staticGetters.$store = {
        state,
        getters,
        rootState,
        rootGetters,
      };
      output = getterFn.call(targetModule._staticGetters);
    } else {
      const thisObject = { $store: { state, getters, rootState, rootGetters } };
      for (const key of Object.keys(state)) {
        Object.assign(thisObject, { [key]: (state as any)[key] });
      }
      output = getterFn.call(thisObject);
    }
    return output;
  };
}
