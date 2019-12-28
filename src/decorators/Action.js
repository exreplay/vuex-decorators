import { stores, initStore, getClassName } from './utils';

export default function Action(target, key, descriptor) {
  initStore(target);
  stores[getClassName(target)].actions[key] = ({ state, rootState, commit, dispatch, getters, rootGetters }, payload) => {
    const thisObject = { $store: { state, rootState, commit, dispatch, getters, rootGetters } };
    for (const key of Object.keys(state)) {
      Object.assign(thisObject, { [key]: state[key] });
    }
    return target[key].call(thisObject, payload);
  };
}
