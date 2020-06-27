import Vue from 'vue';
import Vuex from 'vuex';
import { VuexClass, ExportVuexStore, Getter, config } from '../src';
import { stores } from '../src/decorators/utils';

Vue.use(Vuex);

function storeWrapper(doNotConfigStore = false) {
  @VuexClass
  class TestModule {
    moduleName = 'testModule';
    test = 'test';
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

  return { tm, store };
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
  });
});

test('the getter is present in the vuex store object', () => {
  const { store } = storeWrapper();
  expect(Object.keys(store.getters)).toEqual([
    'testModule/getterTest',
    'testModule/getTest',
    'testModule/modifyState',
  ]);
});

test("calling getter returns the value from the 'test' variable", () => {
  const { store } = storeWrapper();
  const testVariable = store.getters['testModule/getTest'];
  const getterTestVariable = store.getters['testModule/getterTest'];
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
