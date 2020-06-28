import { config } from './utils';

export function GetterFn<S, R>(targetModule: any, getterFn: () => void) {
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
