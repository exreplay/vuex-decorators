import Vue from 'vue';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var stores = {};
function assignStates(Obj) {
  var target = new Obj();
  var props = Object.getOwnPropertyNames(target);

  if (typeof target['moduleName'] === 'undefined') {
    console.error("You need to define the 'moduleName' class variable inside '".concat(target.constructor.name, "'! Otherwise it won't be added to the Vuex Store!"));
  }

  initStore(target);
  stores[getClassName(target)]['moduleName'] = target['moduleName'];
  props.splice(props.indexOf('moduleName'), 1);

  var stateFactory = function stateFactory() {
    return getStates(target, props);
  };

  stores[getClassName(target)].state = stateFactory;
  var proto = Object.getPrototypeOf(target);
  var functions = Object.getOwnPropertyNames(proto);
  var getters = [];
  var mutations = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var func = _step.value;
      var descriptor = Object.getOwnPropertyDescriptor(proto, func);

      if (descriptor && descriptor.get) {
        getters[func] = function (state, getters, rootState, rootGetters) {
          var thisObject = {
            $store: {
              state: state,
              getters: getters,
              rootState: rootState,
              rootGetters: rootGetters
            }
          };

          var _arr = Object.keys(state);

          for (var _i = 0; _i < _arr.length; _i++) {
            var key = _arr[_i];
            Object.assign(thisObject, _defineProperty({}, key, state[key]));
          }

          var output = descriptor.get.call(thisObject);
          return output;
        };
      } else if (descriptor && descriptor.set) {
        mutations[func] = function (state, payload) {
          descriptor.set.call(state, payload);
        };
      }
    };

    for (var _iterator = functions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  Object.assign(stores[getClassName(target)].getters, getters);
  Object.assign(stores[getClassName(target)].mutations, mutations);
}
function getStates(target, props) {
  var s = {};

  for (var i = 0; i < Object.keys(props).length; i++) {
    var prop = props[Object.keys(props)[i]];
    s[prop] = target[prop];
  }

  return s;
}
function initStore(target) {
  if (typeof stores[getClassName(target)] === 'undefined') {
    stores[getClassName(target)] = {
      namespaced: true,
      state: function state() {
        return {};
      },
      getters: {},
      actions: {},
      mutations: {}
    };
  }
}
function getClassName(Obj) {
  var target = new Obj.constructor();
  if (typeof target === 'function') target = new Obj();
  return target['moduleName'];
}

function Action(target, key, descriptor) {
  initStore(target);

  stores[getClassName(target)].actions[key] = function (_ref, payload) {
    var state = _ref.state,
        rootState = _ref.rootState,
        commit = _ref.commit,
        dispatch = _ref.dispatch,
        getters = _ref.getters,
        rootGetters = _ref.rootGetters;
    var thisObject = {
      $store: {
        state: state,
        rootState: rootState,
        commit: commit,
        dispatch: dispatch,
        getters: getters,
        rootGetters: rootGetters
      }
    };

    var _arr = Object.keys(state);

    for (var _i = 0; _i < _arr.length; _i++) {
      var _key = _arr[_i];
      Object.assign(thisObject, _defineProperty({}, _key, state[_key]));
    }

    return target[key].call(thisObject, payload);
  };
}

function ExportVuexStore(target) {
  var exportAsReadyObject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var name = getClassName(target);
  if (!exportAsReadyObject) return stores[name];else return _defineProperty({}, name, stores[name]);
}

function Getter(target, key, descriptor) {
  initStore(target);

  stores[getClassName(target)].getters[key] = function (state, getters, rootState, rootGetters) {
    var thisObject = {
      $store: {
        state: state,
        getters: getters,
        rootState: rootState,
        rootGetters: rootGetters
      }
    };

    var _arr = Object.keys(state);

    for (var _i = 0; _i < _arr.length; _i++) {
      var _key = _arr[_i];
      Object.assign(thisObject, _defineProperty({}, _key, state[_key]));
    }

    var output = target[key].call(thisObject);
    return output;
  };
}

function HasGetter(target, key, descriptor) {
  initStore(target);

  stores[getClassName(target)].getters[key] = function (state) {
    return state[key];
  };
}

function HasGetterAndMutation(target, key, descriptor) {
  initStore(target);

  stores[getClassName(target)].getters[key] = function (state) {
    return state[key];
  };

  stores[getClassName(target)].mutations[key] = function (state, val) {
    Vue.set(state, key, val);
  };
}

function Mutation(target, key, descriptor) {
  initStore(target);

  stores[getClassName(target)].mutations[key] = function (state, payload) {
    target[key].call(state, payload);
  };
}

function VuexClass(options) {
  if (typeof options === 'function') {
    assignStates(options);
  } else {
    return function (target) {
      assignStates(target);
      var store = stores[getClassName(target)];

      if (typeof options !== 'undefined' && typeof options.extend !== 'undefined') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          var _loop = function _loop() {
            var obj = _step.value;
            var extendStore = ExportVuexStore(obj);
            var oldState = store.state();
            var newState = extendStore.state();

            var stateFactory = function stateFactory() {
              return Object.assign(oldState, newState);
            };

            store.state = stateFactory;
            Object.assign(store.getters, extendStore.getters);
            Object.assign(store.actions, extendStore.actions);
            Object.assign(store.mutations, extendStore.mutations);
          };

          for (var _iterator = options.extend[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      if (typeof options !== 'undefined') {
        if (options.persistent) {
          store['persistent'] = options.persistent;
        } else {
          store['persistent'] = false;
        }
      }
    };
  }
}

export { Action, ExportVuexStore, Getter, HasGetter, HasGetterAndMutation, Mutation, VuexClass };
