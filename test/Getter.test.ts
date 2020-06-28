import Vue from 'vue';
import Vuex from 'vuex';
import {
  VuexClass,
  ExportVuexStore,
  Getter,
  config,
  getModule,
  Nested,
} from '../src';
import { stores } from '../src/decorators/utils';

Vue.use(Vuex);

function storeWrapper(doNotConfigStore = false) {
  @VuexClass
  class NestedModule {
    moduleName = 'nested';
    lazyTest = 'nested';
    get test() {
      return this.lazyTest;
    }
  }
  @VuexClass
  class TestModule {
    moduleName = 'testModule';
    test = 'test';
    @Nested() nested = new NestedModule();
    get nestedTest() {
      return this.nested.test;
    }
    get getterTest() {
      return this.test;
    }
    @Getter getTest() {
      return this.test;
    }
    @Getter modifyState() {
      this.test = 'hello';
      return this.test;
    }
  }

  const tm = ExportVuexStore(TestModule);

  const store = new Vuex.Store({
    modules: {
      [tm.moduleName as string]: tm,
    },
  });

  if (!doNotConfigStore) config.store = store;

  const module = getModule(TestModule);

  return { tm, store, module };
}

beforeEach(() => {
  for (const store of Object.keys(stores)) delete stores[store];
  config.store = undefined;
});

test('check if getter exists and is a function', () => {
  const { tm } = storeWrapper();
  expect(tm.getters).toEqual({
    getterTest: expect.any(Function),
    getTest: expect.any(Function),
    modifyState: expect.any(Function),
    nestedTest: expect.any(Function),
  });
});

test('the getter is present in the vuex store object', () => {
  const { store } = storeWrapper();
  expect(Object.keys(store.getters)).toEqual([
    'testModule/nestedTest',
    'testModule/getterTest',
    'testModule/getTest',
    'testModule/modifyState',
    'testModule/nested/test',
  ]);
});

test("calling getter returns the value from the 'test' variable", () => {
  const { store, module } = storeWrapper();
  const testVariable = store.getters['testModule/getTest'];
  const getterTestVariable = module.getterTest;
  expect(module.nestedTest).toBe('nested');
  expect(testVariable).toBe('test');
  expect(getterTestVariable).toBe('test');
});

test('getters should work without the store passed to config', () => {
  const { store } = storeWrapper(true);
  const testVariable = store.getters['testModule/getTest'];
  expect(testVariable).toBe('test');
});

test('should throw warning when state is being modified directly from action', async () => {
  const spy = jest.spyOn(global.console, 'warn').mockImplementation();

  const { store } = storeWrapper();
  const testVariable = store.getters['testModule/modifyState'];

  expect(spy.mock.calls[0][0]).toBe(
    '[testModule/test]: You cannot change this state outside a mutation.'
  );
  expect(spy).toHaveBeenCalledTimes(1);

  expect(testVariable).toBe('test');

  spy.mockRestore();
});
