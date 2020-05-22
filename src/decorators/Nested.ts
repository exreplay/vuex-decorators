import { initStore, getClassName, stores } from './utils';

function Nested(value?: any) {
  const obj = value ? new value() : {};

  return (target: any, key: string | symbol) => {
    initStore(target);
    const targetObj = new target.constructor();
    const moduleName = targetObj[key]?.moduleName || obj.moduleName;

    if (!moduleName) return;

    stores[getClassName(target)].nested!.push({
      prop: key.toString(),
      moduleName,
    });
  };
}

export default Nested;
