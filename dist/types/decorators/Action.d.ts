export default function Action<T, R>(target: T, key: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => R>): void;
