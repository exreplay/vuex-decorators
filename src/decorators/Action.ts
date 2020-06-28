import { ActionContext, Action as VuexAction } from 'vuex';
import { stores, initStore, getClassName, config } from './utils';

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

    if (config.store && targetModule._caller) {
      targetModule[`${targetModule._caller}statics`].$store = context;
      return (target as any)[key].call(
        targetModule[`${targetModule._caller}statics`],
        payload
      );
    } else if (config.store && targetModule._statics) {
      targetModule._statics.$store = context;
      return (target as any)[key].call(targetModule._statics, payload);
    } else {
      const thisObject = { $store: context };
      for (const key of Object.keys(context.state)) {
        Object.assign(thisObject, { [key]: context.state[key] });
      }
      return (target as any)[key].call(thisObject, payload);
    }
  };

  stores[getClassName(target)].actions![key as string] = action;
}
