import { Store as VuexStore, ActionContext, Module, GetterTree } from 'vuex';

export interface VuexClassOptions {
  persistent?: Array<string>;
  extend?: Array<any>;
  namespaced?: boolean;
}

export interface VuexModuleClass<S, R> extends Function {
  [index: string]: VuexModuleClass<S, R> | any;
  moduleName?: string;
  _genStatic?: () => void;
  _caller?: string;
  _staticGetters?: {
    [index: string]: any;
    $store: {
      state: S;
      getters: any;
      rootState: R;
      rootGetters: any;
    };
  };
  _statics?: {
    [index: string]: any;
    $store: ActionContext<S, R>;
  };
}

export interface NewableVuexModuleClass<S, R> extends VuexModuleClass<S, R> {
  new (): this;
}

export interface VuexModuleTarget<S = any, R = any> extends Object {
  [index: string]: any;
  constructor: VuexModuleClass<S, R> & Function;
}

export type ConstructorOf<C> = { new (...args: any[]): C };

export interface PropertiesToDefine {
  [key: string]: PropertyDescriptor & ThisType<any>;
}

export interface NestedModule<N> {
  prop: string;
  moduleName: string;
  module: N;
}

export interface AverModule<S, R, N> extends Module<S, R> {
  moduleName?: string;
  persistent?: string[] | boolean;
  nested: NestedModule<N>[];
  _getterFns?: GetterTree<S, R>;
}

export interface Store<S, R, N> {
  [key: string]: AverModule<S, R, N> | undefined;
}

export interface Config<S> {
  store?: VuexStore<S>;
}
