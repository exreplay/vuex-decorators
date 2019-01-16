import Vue from 'vue';
import { stores, initStore, getClassName } from './utils';

export default function HasGetterAndMutation(target, key, descriptor) {
    initStore(target);
    stores[getClassName(target)].getters[key] = state => state[key];
    stores[getClassName(target)].mutations[key] = (state, val) => {
        Vue.set(state, key, val);
    };
}