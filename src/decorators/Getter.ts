import { Getter } from 'vuex';
import { stores, initStore, getClassName } from './utils';
import { GetterFn } from './helpers';
import { VuexModuleTarget } from '../types';

export default function Getter<T extends VuexModuleTarget<S, R>, S, R>(
  target: T,
  key: string | symbol
) {
  initStore(target);
  const store = stores[getClassName(target)]!;

  if (!store._getterFns) store._getterFns = {};

  const targetModule = target.constructor;

  store._getterFns[key as string] = GetterFn(
    targetModule,
    target[key as string]
  );
}
