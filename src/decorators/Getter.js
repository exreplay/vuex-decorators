import { stores, initStore, getClassName } from './utils';

export default function Getter(target, key, descriptor) {
    initStore(target);
    stores[getClassName(target)].getters[key] = (state, getters, rootState, rootGetters) => {
        const thisObject = { $store: { state, getters, rootState, rootGetters }};
        for(const key of Object.keys(state)) {
            Object.assign(thisObject, { [key]: state[key] });
        }
        const output = target[key].call(thisObject);
        return output;
    };
}
