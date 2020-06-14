import Vue from 'vue';
import Vuex from 'vuex';
import {
  VuexClass,
  ExportVuexStore,
  Action,
  HasGetterAndMutation,
  config,
  Mutation,
  Getter,
  Nested,
} from '../src';
import { VuexModule } from '../src/decorators/VuexClass';
import { stores } from '../src/decorators/utils';

Vue.use(Vuex);

function storeWrapper(doNotConfigStore = false) {
  @VuexClass({
    namespaced: true,
  })
  class NestedStore extends VuexModule {
    private moduleName = 'nestedStore';

    nestedState = 'nested';

    @Getter getNestedState() {
      return this.nestedState;
    }
  }

  @VuexClass
  class TestModule extends VuexModule {
    private moduleName = 'testModule';

    plainTestState = 'servus';
    @HasGetterAndMutation testState = 'test';

    @Nested() nested = new NestedStore();

    @Getter getTestState() {
      return this.testState;
    }

    @Mutation setTestState(val: string) {
      this.testState = val;
    }

    @Action async testMutation$store() {
      (this.$store.state as any).testState = 'testModified';
      return this.$store.rootGetters['testModule/nestedStore/getNestedState'];
    }

    @Action async testMutationThisContext() {
      this.testState = 'testModified';
      return this.nested.getNestedState();
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

test('check if action exists and is a function', () => {
  const { tm } = storeWrapper();
  expect(tm.actions).toEqual({
    testMutationThisContext: expect.any(Function),
    testMutation$store: expect.any(Function),
  });
});

test("dispatching the 'testMutationThisContext' action mutates the test state to 'testModified' and return state from nested module", async () => {
  const { store } = storeWrapper();
  const value = await store.dispatch('testModule/testMutationThisContext');
  expect(value).toBe('nested');
  expect((store.state as any).testModule.testState).toBe('testModified');
});

test("dispatching the 'testMutation$store' action mutates the test state to 'testModified' and return state from nested module", async () => {
  const { store } = storeWrapper();
  const value = await store.dispatch('testModule/testMutation$store');
  expect(value).toBe('nested');
  expect((store.state as any).testModule.testState).toBe('testModified');
});

test('actions should work without the store passed to config', async () => {
  const { store } = storeWrapper(true);
  const value = await store.dispatch('testModule/testMutation$store');
  expect(value).toBe('nested');
  expect((store.state as any).testModule.testState).toBe('testModified');
});
