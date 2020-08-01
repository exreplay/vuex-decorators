import { createStore } from 'vuex';
import {
  VuexClass,
  ExportVuexStore,
  Action,
  HasGetterAndMutation,
} from '../src';
import { VuexModule } from '../src/decorators/VuexClass';

@VuexClass
class TestModule extends VuexModule {
  moduleName = 'testModule';
  @HasGetterAndMutation testState = 'test';
  @Action test() {}
  @Action testMutation() {
    this.$store.commit('testState', 'testModified');
  }
}

const tm = ExportVuexStore(TestModule);

const store = createStore<any>({
  modules: {
    [tm.moduleName as string]: tm,
  },
});

test('check if action exists and is a function', () => {
  expect(tm.actions).toEqual({
    test: expect.any(Function),
    testMutation: expect.any(Function),
  });
});

test("dispatching the 'testMutation' action mutates the test state to 'testModified'", async () => {
  await store.dispatch('testModule/testMutation');
  expect(store.state.testModule.testState).toBe('testModified');
});
