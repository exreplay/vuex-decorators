import Vue from 'vue';
import Vuex, { Module } from 'vuex';
import {
  VuexClass,
  ExportVuexStore,
  getModule,
  Nested,
  VuexModule,
} from '../src';
import { stores, config } from '../src/decorators/utils';

Vue.use(Vuex);

beforeEach(() => {
  for (const store of Object.keys(stores)) delete stores[store];
});

function storeWrapper<S, R>(modules: { [key: string]: Module<S, R> }) {
  return new Vuex.Store({
    modules,
  });
}

test('nesting should work correctly', async () => {
  @VuexClass
  class PleaseStop extends VuexModule {
    private moduleName = 'pleaseStopModule';
    test = 'please stop nesting!';
  }

  @VuexClass({
    namespaced: false,
  })
  class WowWhat {
    private moduleName = 'wowWhatModule';
    testWow = 'what the nesting!';
    @Nested pleaseStopModule = new PleaseStop();
  }

  @VuexClass
  class FurtherNestedModule {
    private moduleName = 'furtherNestedModule';
    test = 'hello world from FurtherNestedModule!';
    @Nested wowWhatModule = new WowWhat();
  }

  @VuexClass
  class NestedModule extends VuexModule {
    private moduleName = 'nestedModule';
    test = 'hello world from NestedModule!';
    @Nested furtherNestedModule = new FurtherNestedModule();
  }

  @VuexClass
  class Test {
    private moduleName = 'test';
    test = 'hello world from TestModule!';
    @Nested nestedModule = new NestedModule();
  }

  const tm = ExportVuexStore(Test);
  const store = storeWrapper({
    [tm.moduleName as string]: tm,
  });
  config.store = store;

  const module = getModule(Test);

  expect(
    module.nestedModule.furtherNestedModule.wowWhatModule.pleaseStopModule.test
  ).toBe('please stop nesting!');

  // namespaced false should still return the correct state
  expect(module.nestedModule.furtherNestedModule.wowWhatModule.testWow).toBe(
    'what the nesting!'
  );
});