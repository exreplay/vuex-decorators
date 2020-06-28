import { Getter } from 'vuex';
import { stores, initStore, getClassName } from './utils';
import { GetterFn } from './helpers';

export default function Getter<T, R>(
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => R>
) {
  initStore(target);
  const store = stores[getClassName(target)];

  if (!store._getterFns) store._getterFns = {};

  const targetModule = (target as any).constructor;

  store._getterFns[key as string] = GetterFn(
    targetModule,
    (target as any)[key]
  );
}
