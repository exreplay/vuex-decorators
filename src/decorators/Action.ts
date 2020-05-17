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
    const thisObject = { $store: context };
    for (const key of Object.keys(context.state)) {
      Object.assign(thisObject, { [key]: context.state[key] });
    }
    return (target as any)[key].call(thisObject, payload);
  };

  stores[getClassName(target)].actions![key as string] = action;
}
