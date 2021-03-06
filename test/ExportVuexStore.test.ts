import { VuexClass, ExportVuexStore, Nested } from '../src';
import { AverModule } from '../src/types';

function storeWrapper(exportAsReadyObject = false) {
  @VuexClass
  class TestModule {
    moduleName = 'testModule';
  }

  const tm = ExportVuexStore(TestModule, exportAsReadyObject);
  return tm;
}

test('check if object is a valid vuex object', <S = any, R = any>() => {
  const tm = storeWrapper();
  const obj: AverModule<S, R> = {
    namespaced: true,
    nested: [],
    getters: {},
    actions: {},
    mutations: {},
    modules: {},
    moduleName: 'testModule',
    persistent: false,
  };
  expect(JSON.stringify(tm)).toEqual(JSON.stringify(obj));
  expect(tm.state).toEqual(expect.any(Function));
});

test('tm should be plain object with moduleName prop', () => {
  const tm = storeWrapper();
  expect(tm.moduleName).toBe('testModule');
});

test('tm object should have a key like the moduleName', () => {
  const tm = storeWrapper(true);
  expect(Object.keys(tm)).toEqual(['testModule']);
});

test('should return empty object when passing wrong object', () => {
  class Test {}
  const tm = ExportVuexStore(Test);
  expect(tm).toEqual({ nested: [] });
});
