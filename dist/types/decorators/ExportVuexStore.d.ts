import { AverModule } from './utils';
export default function ExportVuexStore<S, R, T>(target: T, exportAsReadyObject?: boolean): AverModule<S, R> | {
    [key: string]: AverModule<S, R>;
};
