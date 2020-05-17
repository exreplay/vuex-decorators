import { ActionContext } from 'vuex';
interface VuexClassOptions {
    persistent?: Array<string>;
    extend?: Array<any>;
}
export declare class VuexModule<S = ThisType<any>, R = any> {
    $store: ActionContext<S, R>;
}
export declare function VuexClass<S>(module?: Function): void;
export declare function VuexClass<S>(options?: VuexClassOptions): ClassDecorator;
export {};
