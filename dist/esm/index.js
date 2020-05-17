import Vue from 'vue';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var stores = {};
function assignStates(Obj) {
    var target = new Obj();
    var props = Object.getOwnPropertyNames(target);
    if (typeof target.moduleName === 'undefined') {
        console.error("You need to define the 'moduleName' class variable inside '" + target.constructor.name + "'! Otherwise it won't be added to the Vuex Store!");
    }
    initStore(target);
    stores[getClassName(target)].moduleName = target.moduleName;
    props.splice(props.indexOf('moduleName'), 1);
    var stateFactory = function () { return getStates(target, props); };
    stores[getClassName(target)].state = stateFactory;
    var proto = Object.getPrototypeOf(target);
    var functions = Object.getOwnPropertyNames(proto);
    var getters = {};
    var mutations = {};
    var _loop_1 = function (func) {
        var descriptor = Object.getOwnPropertyDescriptor(proto, func);
        if (descriptor && descriptor.get) {
            getters[func] = function (state, getters, rootState, rootGetters) {
                var thisObject = {
                    $store: { state: state, getters: getters, rootState: rootState, rootGetters: rootGetters },
                };
                var _loop_2 = function (key) {
                    Object.defineProperty(thisObject, key, {
                        get: function () { return state[key]; },
                    });
                };
                for (var _i = 0, _a = Object.keys(state); _i < _a.length; _i++) {
                    var key = _a[_i];
                    _loop_2(key);
                }
                var output = descriptor.get.call(thisObject);
                return output;
            };
        }
        else if (descriptor && descriptor.set) {
            mutations[func] = function (state, payload) {
                descriptor.set.call(state, payload);
            };
        }
    };
    for (var _i = 0, functions_1 = functions; _i < functions_1.length; _i++) {
        var func = functions_1[_i];
        _loop_1(func);
    }
    Object.assign(stores[getClassName(target)].getters, getters);
    Object.assign(stores[getClassName(target)].mutations, mutations);
}
function getStates(target, props) {
    var s = {};
    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
        var prop = props_1[_i];
        s[prop] = target[prop];
    }
    return s;
}
function initStore(target) {
    // tslint:disable-next-line: strict-type-predicates
    if (typeof stores[getClassName(target)] === 'undefined') {
        stores[getClassName(target)] = {
            namespaced: true,
            state: function () {
                return {};
            },
            getters: {},
            actions: {},
            mutations: {},
        };
    }
}
function getClassName(Obj) {
    var target = new Obj.constructor();
    if (typeof target === 'function')
        target = new Obj();
    return target.moduleName;
}

function Action(target, key, descriptor) {
    initStore(target);
    var action = function (context, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var thisObject, _i, _a, key_1;
            var _b;
            return __generator(this, function (_c) {
                thisObject = { $store: context };
                for (_i = 0, _a = Object.keys(context.state); _i < _a.length; _i++) {
                    key_1 = _a[_i];
                    Object.assign(thisObject, (_b = {}, _b[key_1] = context.state[key_1], _b));
                }
                return [2 /*return*/, target[key].call(thisObject, payload)];
            });
        });
    };
    stores[getClassName(target)].actions[key] = action;
}

function ExportVuexStore(target, exportAsReadyObject) {
    var _a;
    if (exportAsReadyObject === void 0) { exportAsReadyObject = false; }
    var name = getClassName(target);
    if (!exportAsReadyObject)
        return stores[name];
    else
        return _a = {}, _a[name] = stores[name], _a;
}

function Getter(target, key, descriptor) {
    initStore(target);
    stores[getClassName(target)].getters[key] = function (state, getters, rootState, rootGetters) {
        var _a;
        var thisObject = { $store: { state: state, getters: getters, rootState: rootState, rootGetters: rootGetters } };
        for (var _i = 0, _b = Object.keys(state); _i < _b.length; _i++) {
            var key_1 = _b[_i];
            Object.assign(thisObject, (_a = {}, _a[key_1] = state[key_1], _a));
        }
        var output = target[key].call(thisObject);
        return output;
    };
}

function HasGetter(target, key) {
    initStore(target);
    stores[getClassName(target)].getters[key] = function (state) {
        return state[key];
    };
}

function HasGetterAndMutation(target, key) {
    initStore(target);
    stores[getClassName(target)].getters[key] = function (state) { return state[key]; };
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

var VuexModule = /** @class */ (function () {
    function VuexModule() {
    }
    return VuexModule;
}());
function VuexClass(options) {
    if (typeof options === 'function') {
        assignStates(options);
    }
    else {
        return function (target) {
            assignStates(target);
            var store = stores[getClassName(target)];
            var _loop_1 = function (obj) {
                var extendStore = ExportVuexStore(obj);
                var oldState = store.state();
                var newState = extendStore.state();
                var stateFactory = function () { return Object.assign(oldState, newState); };
                store.state = stateFactory;
                Object.assign(store.getters, extendStore.getters);
                Object.assign(store.actions, extendStore.actions);
                Object.assign(store.mutations, extendStore.mutations);
            };
            for (var _i = 0, _a = (options === null || options === void 0 ? void 0 : options.extend) || []; _i < _a.length; _i++) {
                var obj = _a[_i];
                _loop_1(obj);
            }
            if (options === null || options === void 0 ? void 0 : options.persistent)
                store.persistent = options.persistent;
            else
                store.persistent = false;
        };
    }
}

export { Action, ExportVuexStore, Getter, HasGetter, HasGetterAndMutation, Mutation, VuexClass, VuexModule };
//# sourceMappingURL=index.js.map
