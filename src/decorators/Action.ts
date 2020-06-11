import { ActionContext, Action as VuexAction } from 'vuex';
import { stores, initStore, getClassName } from './utils';

export default function Action<T, R>(
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => R>
) {
  initStore(target);

  const action: VuexAction<typeof target, any> = async function (
    context: ActionContext<any, any>,
    payload: any
  ) {
    const targetModule = (target as any).constructor;
    targetModule.$store = context;
    return (target as any)[key].call(targetModule, payload);
  };

  stores[getClassName(target)].actions![key as string] = action;
}
