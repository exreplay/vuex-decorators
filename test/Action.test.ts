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

Vue.use(Vuex);

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

config.store = store;

test('check if action exists and is a function', () => {
  expect(tm.actions).toEqual({
    testMutationThisContext: expect.any(Function),
    testMutation$store: expect.any(Function),
  });
});

test("dispatching the 'testMutationThisContext' action mutates the test state to 'testModified' and return state from nested module", async () => {
  const value = await store.dispatch('testModule/testMutationThisContext');
  expect(value).toBe('nested');
  expect((store.state as any).testModule.testState).toBe('testModified');
});

test("dispatching the 'testMutation$store' action mutates the test state to 'testModified' and return state from nested module", async () => {
  const value = await store.dispatch('testModule/testMutation$store');
  expect(value).toBe('nested');
  expect((store.state as any).testModule.testState).toBe('testModified');
});
