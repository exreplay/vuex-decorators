import { stores, initStore, getStates } from '../src/decorators/utils';
import { assignStates } from '../src/decorators/helpers';

console.error = jest.fn();

beforeEach(() => {
  for (const store of Object.keys(stores)) delete stores[store];
});

test('assignStates should throw a error when moduleName is not present', () => {
  class TestModule {}
  assignStates(TestModule);
  expect(console.error).toHaveBeenCalledTimes(1);
});

test('check if props are correctly extracted from class', () => {
  class TestModule {
    test = 'test';
    test2 = 'test2';
  }
  const target = new TestModule();
  const props = Object.getOwnPropertyNames(target);
  const state = getStates(target, props);
  expect(state).toEqual({ test: 'test', test2: 'test2' });
});

test('check if initializing store creates a valid vuex store object and state is a function and returns a object', () => {
  class TestModule {
    moduleName = 'testModule';
  }
  initStore(TestModule);
  const obj = {
    namespaced: true,
    nested: [],
    getters: {},
    actions: {},
    mutations: {},
    modules: {},
  };
  expect(JSON.stringify(stores.testModule)).toEqual(JSON.stringify(obj));
  expect(stores.testModule?.state()).toEqual({});
  expect(stores.testModule?.state).toEqual(expect.any(Function));
});
