import { stores, initStore, getClassName } from './utils';

export default function Mutation<T, R>(
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => R>
) {
  initStore(target);
  stores[getClassName(target)].mutations![key as string] = <S, R>(
    state: S,
    payload: R
  ) => {
    (target as any)[key].call(state, payload);
  };
}
