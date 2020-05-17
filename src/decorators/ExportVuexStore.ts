import { stores, getClassName, AverModule } from './utils';

export default function ExportVuexStore<S, R, T>(
  target: T,
  exportAsReadyObject = false
): AverModule<S, R> | { [key: string]: AverModule<S, R> } {
  const name = getClassName(target);
  if (!exportAsReadyObject) return stores[name];
  else return { [name]: stores[name] };
}
