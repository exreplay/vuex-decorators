import { stores, getClassName } from './utils';

export default function ExportVuexStore(target, exportAsReadyObject = false) {
  const name = getClassName(target);
  if (!exportAsReadyObject) return stores[name];
  else return { [name]: stores[name] };
}
