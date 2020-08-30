import { ActionContext, Action as VuexAction } from 'vuex';
import { stores, initStore, getClassName, config } from './utils';
import { VuexModuleTarget } from '../types';

export default function Action<T extends VuexModuleTarget<S, R>, S, R>(
  target: T,
  key: string | symbol
) {
  initStore(target);

  const action: VuexAction<typeof target, any> = async function (
    context: ActionContext<any, any>,
    payload: any
  ) {
    const targetModule = target.constructor;

    if (config.store && targetModule._caller) {
      targetModule[`${targetModule._caller}statics`].$store = context;
      return target[key as string].call(
        targetModule[`${targetModule._caller}statics`],
        payload
      );
    } else if (config.store && targetModule._statics) {
      targetModule._statics.$store = context;
      return target[key as string].call(targetModule._statics, payload);
    } else {
      const thisObject = { $store: context };
      for (const key of Object.keys(context.state)) {
        Object.assign(thisObject, { [key]: context.state[key] });
      }
      return target[key as string].call(thisObject, payload);
    }
  };

  stores[getClassName(target)]!.actions![key as string] = action;
}
