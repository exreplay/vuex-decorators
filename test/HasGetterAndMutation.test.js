import Vue from 'vue';
import Vuex from 'vuex';
import { VuexClass, ExportVuexStore, HasGetterAndMutation } from '../src';

Vue.use(Vuex);

@VuexClass
class TestModule {
    moduleName = 'testModule';
    @HasGetterAndMutation test = 'test';
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

test('check if mutation exists and is a function', () => {
  expect(tm.mutations).toEqual({ test: expect.any(Function) });
});

test('the getter is present in the vuex store object', () => {
  expect(Object.keys(store.getters)).toEqual([ 'testModule/test' ]);
});

test('the mutation is present in the vuex store object', () => {
  expect(Object.keys(store._mutations)).toEqual([ 'testModule/test' ]);
});

test('calling getter returns the value from the \'test\' variable', () => {
  const test = store.getters['testModule/test'];
  expect(test).toBe('test');
});

test('calling mutation changes the value from the \'test\' variable and is getting returned by getter', () => {
  store.commit('testModule/test', 'newTest');
  const test = store.getters['testModule/test'];
  expect(test).toBe('newTest');
});
