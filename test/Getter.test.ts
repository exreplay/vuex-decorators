import Vue from 'vue';
import Vuex from 'vuex';
import { VuexClass, ExportVuexStore, Getter } from '../src';

Vue.use(Vuex);

@VuexClass
class TestModule {
  moduleName = 'testModule';
  test = 'test';
  @Getter getTest() {
    return this.test;
  }
}

const tm = ExportVuexStore(TestModule);

const store = new Vuex.Store({
  modules: {
    [tm.moduleName as string]: tm,
  },
});

test('check if getter exists and is a function', () => {
  expect(tm.getters).toEqual({ getTest: expect.any(Function) });
});

test('the getter is present in the vuex store object', () => {
  expect(Object.keys(store.getters)).toEqual(['testModule/getTest']);
});

test("calling getter returns the value from the 'test' variable", () => {
  const testVariable = store.getters['testModule/getTest'];
  expect(testVariable).toBe('test');
});
