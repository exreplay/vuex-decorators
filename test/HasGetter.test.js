import Vue from 'vue';
import Vuex from 'vuex';
import { VuexClass, ExportVuexStore, HasGetter } from '../src';

Vue.use(Vuex);

@VuexClass
class TestModule {
    moduleName = 'testModule';
    @HasGetter test = 'test';
}

const tm = ExportVuexStore(TestModule);

const store = new Vuex.Store({
  modules: {
    [tm.moduleName]: tm
  }
});

test('check if getter exists and is a function', () => {
  expect(tm.getters).toEqual({ test: expect.any(Function) });
});

test('the getter is present in the vuex store object', () => {
  expect(Object.keys(store.getters)).toEqual([ 'testModule/test' ]);
});

test('calling getter returns the value from the \'test\' variable', () => {
  const testVariable = store.getters['testModule/test'];
  expect(testVariable).toBe('test');
});
