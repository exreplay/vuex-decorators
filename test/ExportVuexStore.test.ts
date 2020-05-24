import { VuexClass, ExportVuexStore } from '../src';
import { AverModule } from '../src/decorators/utils';

@VuexClass
class TestModule {
  moduleName = 'testModule';
}

test('check if object is a valid vuex object', <S = any, R = any>() => {
  const tm = ExportVuexStore(TestModule);
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
  const tm = ExportVuexStore(TestModule);
  expect(tm.moduleName).toBe('testModule');
});

test('tm object should have a key like the moduleName', () => {
  const tm = ExportVuexStore(TestModule, true);
  expect(Object.keys(tm)).toEqual(['testModule']);
});
