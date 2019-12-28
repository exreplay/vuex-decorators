export const stores = {};

export function assignStates(Obj) {
  const target = new Obj();
  const props = Object.getOwnPropertyNames(target);
  if (typeof target.moduleName === 'undefined') {
    console.error(`You need to define the 'moduleName' class variable inside '${target.constructor.name}'! Otherwise it won't be added to the Vuex Store!`);
  }

  initStore(target);

  stores[getClassName(target)].moduleName = target.moduleName;
  props.splice(props.indexOf('moduleName'), 1);
    
  const stateFactory = () => getStates(target, props);
  stores[getClassName(target)].state = stateFactory;

  const proto = Object.getPrototypeOf(target);
  const functions = Object.getOwnPropertyNames(proto);

  const getters = [];
  const mutations = [];
    
  for (const func of functions) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, func);
    if (descriptor && descriptor.get) {
      getters[func] = (state, getters, rootState, rootGetters) => {
        const thisObject = { $store: { state, getters, rootState, rootGetters } };
        for (const key of Object.keys(state)) {
          Object.assign(thisObject, { [key]: state[key] });
        }
        const output = descriptor.get.call(thisObject);
        return output;
      };
    } else if (descriptor && descriptor.set) {
      mutations[func] = (state, payload) => {
        descriptor.set.call(state, payload);
      };
    }
  }

  Object.assign(stores[getClassName(target)].getters, getters);
  Object.assign(stores[getClassName(target)].mutations, mutations);
}

export function getStates(target, props) {
  const s = {};
  for (let i = 0; i < Object.keys(props).length; i++) {
    const prop = props[Object.keys(props)[i]];
    s[prop] = target[prop];
  }
  return s;
}

export function initStore(target) {
  if (typeof stores[getClassName(target)] === 'undefined') {
    stores[getClassName(target)] = {
      namespaced: true,
      state: () => { return {}; },
      getters: {},
      actions: {},
      mutations: {}
    };
  }
}

export function getClassName(Obj) {
  let target = new Obj.constructor();
  if (typeof target === 'function') target = new Obj();
  return target.moduleName;
}
