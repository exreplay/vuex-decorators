import { VuexClass, ExportVuexStore } from '../src';
import { AverModule } from '../src/decorators/utils';

function storeWrapper(exportAsReadyObject = false) {
  @VuexClass
  class TestModule {
    moduleName = 'testModule';
  }

  const tm = ExportVuexStore(TestModule, exportAsReadyObject);
  return tm;
}

test('check if object is a valid vuex object', <S = any, R = any, N = any>() => {
  const tm = storeWrapper();
  const obj: AverModule<S, R, N> = {
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
