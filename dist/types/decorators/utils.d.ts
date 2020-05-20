import { Store as VuexStore, Module } from 'vuex';
export interface AverModule<S, R> extends Module<S, R> {
    moduleName?: string;
    persistent?: string[] | boolean;
}
interface Store<S, R> {
    [key: string]: AverModule<S, R>;
}
interface Config<S> {
    store?: VuexStore<S>;
}
export declare const config: Config<any>;
export declare const stores: Store<any, any>;
export declare function assignStates<S>(Obj: any): void;
export declare function getStates<T>(target: T, props: string[]): {
    [key: string]: any;
};
export declare function initStore<T>(target: T): void;
export declare function getClassName(Obj: any): string;
export {};
