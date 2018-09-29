const stores = {};

export function VuexClass(options) {
    if (typeof options === 'function') {
        assignStates(options);
    }
    else {
        return (target) => {
            let store = stores[target.name];
            if (typeof options.extend !== "undefined") {
                for (let i = 0; i < Object.keys(options.extend).length; i++) {
                    const obj = options.extend[Object.keys(options.extend)[i]];
                    const extendStore = stores[obj.name];
                    Object.assign(store.state, extendStore.state);
                    Object.assign(store.getters, extendStore.getters);
                    Object.assign(store.actions, extendStore.actions);
                    Object.assign(store.mutations, extendStore.mutations);
                }
            }
            assignStates(target);
            if (options.moduleName)
                store['moduleName'] = options.moduleName;
            if (options.persistent)
                store['persistent'] = options.persistent;
            else
                store['persistent'] = false;
        };
    }
}

export function Getter(target, key, descriptor) {
    initStore(target);
    stores[getClassName(target)].getters[key] = target[key];
}

export function Mutation(target, key, descriptor) {
    initStore(target);
    stores[getClassName(target)].mutations[key] = target[key];
}

export function Action(target, key, descriptor) {
    initStore(target);
    stores[getClassName(target)].actions[key] = target[key];
}

export function ExportVuexStore(target) {
    return stores[target.name];
}

function assignStates(Obj) {
    const target = new Obj();
    const props = Object.getOwnPropertyNames(target);
    
    initStore(target);
    
    const stateFactory = () => getStates(target, props);
    stores[getClassName(target)].state = stateFactory;
}

function getStates(target, props) {
    const s = {};
    for(let i = 0; i < Object.keys(props).length; i++) {
        const prop = props[Object.keys(props)[i]];
        s[prop] = target[prop];
    }
    return s;
}

function initStore(target) {
    if (typeof stores[getClassName(target)] === 'undefined') {
        stores[getClassName(target)] = {
            namespaced: true,
            state: () => { return {} },
            getters: {},
            actions: {},
            mutations: {}
        };
    }
}

function getClassName(target) {
    if (typeof target.constructor.name === 'undefined') {
        const results = (/function\s([^(]{1,})\(/).exec((target.constructor).toString());
        return (results && results.length > 1) ? results[1].trim() : '';
    } else {
        return target.constructor.name;
    }
}
