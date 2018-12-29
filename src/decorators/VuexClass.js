import ExportVuexStore from './ExportVuexStore';
import { stores, assignStates, getClassName } from './utils';

export default function VuexClass(options) {
    if (typeof options === 'function') {
        assignStates(options);
    } else {
        return (target) => {
            let store = stores[getClassName(target)];

            assignStates(target);

            if (typeof options !== 'undefined' && typeof options.extend !== 'undefined') {
                for (const obj of options.extend) {
                    const extendStore = ExportVuexStore(obj);
                    const oldState = store.state();
                    const newState = extendStore.state();
                    const stateFactory = () => Object.assign(oldState, newState);
                    store.state = stateFactory;
                    Object.assign(store.getters, extendStore.getters);
                    Object.assign(store.actions, extendStore.actions);
                    Object.assign(store.mutations, extendStore.mutations);
                }
            }
            if (typeof options !== 'undefined') {
                if (options.persistent) { store['persistent'] = options.persistent; } else { store['persistent'] = false; }
            }
        };
    }
}