import { AverModule } from './utils';
export declare type ConstructorOf<C> = {
    new (...args: any[]): C;
};
export interface PropertiesToDefine {
    [key: string]: PropertyDescriptor & ThisType<any>;
}
export declare function generateStaticStates<S, R>(store: AverModule<S, R>, propertiesToDefine: PropertiesToDefine): PropertiesToDefine;
export declare function generateStaticGetters<S, R>(store: AverModule<S, R>, propertiesToDefine: PropertiesToDefine): PropertiesToDefine;
export declare function generateStaticMutations<S, R>(store: AverModule<S, R>, propertiesToDefine: PropertiesToDefine): PropertiesToDefine;
export declare function generateStaticActions<S, R>(store: AverModule<S, R>, propertiesToDefine: PropertiesToDefine): PropertiesToDefine;
export declare function getModule<S>(module: ConstructorOf<S>): S;
