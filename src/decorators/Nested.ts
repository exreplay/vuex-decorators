import { initStore, getClassName, stores } from './utils';
import {
  VuexModuleTarget,
  VuexModuleClass,
  NewableVuexModuleClass,
} from '../types';

function Nested<S, R>(value?: VuexModuleClass<S, R>) {
  return <T extends VuexModuleTarget<S, R>, S, R>(
    target: T,
    key: string | symbol
  ) => {
    initStore(target);

    const targetObj = new (target.constructor as NewableVuexModuleClass<
      S,
      R
    >)();
    const moduleName =
      (targetObj[key as string] as VuexModuleClass<S, R>)?.moduleName ||
      (value ? new (value as NewableVuexModuleClass<S, R>)().moduleName : '');

    if (!moduleName) return;

    stores[getClassName(target)]!.nested.push({
      prop: key.toString(),
      moduleName,
      module:
        value ||
        (targetObj[key as string] as VuexModuleClass<S, R>).constructor,
    });
  };
}

export default Nested;
