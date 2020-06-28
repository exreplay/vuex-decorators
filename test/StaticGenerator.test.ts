import Vuex, { Store } from 'vuex';
import {
  VuexClass,
  ExportVuexStore,
  Mutation,
  HasGetterAndMutation,
  Action,
  VuexModule,
  Getter,
  Nested,
} from '../src';
import { stores, config } from '../src/decorators/utils';
import { createLocalVue, mount } from '@vue/test-utils';
import {
  getModule,
  generateStaticStates,
  PropertiesToDefine,
  generateStaticGetters,
  generateStaticMutations,
  generateStaticActions,
  generateStaticNestedProperties,
  constructPath,
} from '../src/decorators/StaticGenerators';

interface PayloadInterface {
  test1: string;
  test2?: string[];
}

const localVue = createLocalVue();
localVue.use(Vuex);

beforeEach(() => {
  for (const store of Object.keys(stores)) delete stores[store];
  config.store = undefined;
});

function storeFactory(setStoreToConfig = true, doNotExport = false) {
  @VuexClass
  class NestedModule extends VuexModule {
    private moduleName = 'nestedModule';
    test = 'test';
  }

  @VuexClass
  class TestModule extends VuexModule {
    private moduleName = 'testModule';

    @Nested() nestedModule = new NestedModule();

    testState = 'test';

    @HasGetterAndMutation public test = 'test';

    get getSetTest() {
      return this.test;
    }

    set getSetTest(val) {
      this.test = val;
    }

    get nestedTest() {
      return this.nestedModule.test;
    }

    /**
     * Returns the char length of the test variable.
     */
    public get testCharCount(): number {
      return this.test.length;
    }

    /**
     * Returns the char length of the test variable times 2.
     */
    @Getter public testCharCountTimes2(): number {
      return this.test.length * 2;
    }

    @Mutation public setTest(val: string) {
      this.test = val;
    }

    @Action public async fetchTest(
      payload: PayloadInterface
    ): Promise<boolean> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      this.$store.commit('setTest', payload.test1);
      return true;
    }
  }

  @VuexClass
  class TestModule2 extends VuexModule {
    private moduleName = 'testModule2';
    @Nested() nestedModule = new NestedModule();
  }

  let modules = {};
  if (!doNotExport) {
    const testModule = ExportVuexStore(TestModule);
    const testModule2 = ExportVuexStore(TestModule2);
    modules = {
      [testModule.moduleName as string]: testModule,
      [testModule2.moduleName as string]: testModule2,
    };
  }
  const store = new Vuex.Store({
    modules,
  });

  if (setStoreToConfig) config.store = store;
  else config.store = undefined;

  const module = getModule(TestModule);
  const module2 = getModule(TestModule2);

  return { store, TestModule, module, module2 };
}

function wrapperFactory<S>(store: Store<S>, module: any) {
  return mount(
    {
      template:
        '<div>{{ testCharCount }} {{ testCharCountTimes2 }} {{ test }}</div>',
      computed: {
        test() {
          return module.test;
        },
        testCharCount() {
          return module.testCharCount;
        },
        testCharCountTimes2() {
          return module.testCharCountTimes2();
        },
      },
    },
    {
      localVue,
      store,
    }
  );
}

test('getModule should not call _genStatic when _statics is already defined', () => {
  const { TestModule } = storeFactory(true, true);
  expect(() => getModule(TestModule)).not.toThrow();
});

test('generated properties should be reactive', async () => {
  const { store, module } = storeFactory();
  const component = wrapperFactory(store, module);
  expect(component.text()).toBe('4 8 test');

  await module.fetchTest({ test1: 'hello' });
  await component.vm.$nextTick();
  expect(component.text()).toBe('5 10 hello');

  module.test = 'world';
  await component.vm.$nextTick();
  expect(component.text()).toBe('5 10 world');

  module.setTest('hello world!');
  await component.vm.$nextTick();
  expect(component.text()).toBe('12 24 hello world!');
});

test('should generate static states correctly', () => {
  const { module } = storeFactory();
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticStates(stores.testModule, propertiesToDefine);
  expect(propertiesToDefine).toEqual({
    testState: {
      get: expect.any(Function),
      set: expect.any(Function),
    },
    test: {
      get: expect.any(Function),
      set: expect.any(Function),
    },
  });

  expect(propertiesToDefine.test.get!()).toBe('test');
  expect(module.test).toBe('test');
});

test('should generate static getters correctly', () => {
  const { module } = storeFactory();
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticGetters(stores.testModule, propertiesToDefine);
  expect(propertiesToDefine).toEqual({
    testCharCountTimes2: {
      get: expect.any(Function),
    },
    test: {
      get: expect.any(Function),
    },
    getSetTest: {
      get: expect.any(Function),
    },
    nestedTest: {
      get: expect.any(Function),
    },
    testCharCount: {
      get: expect.any(Function),
    },
  });

  expect(propertiesToDefine.nestedTest.get!()).toBe('test');
  expect(module.nestedTest).toBe('test');
  expect(propertiesToDefine.test.get!()).toBe('test');
  expect(module.test).toBe('test');
  expect(propertiesToDefine.testCharCount.get!()).toBe(4);
  expect(module.testCharCount).toBe(4);
  expect(propertiesToDefine.testCharCountTimes2.get!()()).toBe(8);
  expect(module.testCharCountTimes2()).toBe(8);

  delete config.store;

  expect(propertiesToDefine.testCharCount.get!()).toBeUndefined();
  expect(propertiesToDefine.testCharCountTimes2.get!()()).toBeUndefined();
});

test('should generate static mutations correctly', () => {
  const { store, module } = storeFactory();
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticMutations(stores.testModule, propertiesToDefine);

  expect(propertiesToDefine).toEqual({
    test: {
      value: expect.any(Function),
    },
    setTest: {
      value: expect.any(Function),
    },
    getSetTest: {
      value: expect.any(Function),
    },
  });

  propertiesToDefine.test.value!('test2');
  expect(store.getters['testModule/test']).toBe('test2');
  expect(module.test).toBe('test2');

  propertiesToDefine.setTest.value!('test3');
  expect(store.getters['testModule/test']).toBe('test3');
  expect(module.test).toBe('test3');
});

test('should generate get and set for properties with HasGetterAndMutation', () => {
  const { store, module } = storeFactory();
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticGetters(stores.testModule, propertiesToDefine);
  generateStaticMutations(stores.testModule, propertiesToDefine);

  propertiesToDefine.test.set!('test2');
  expect(propertiesToDefine.test.get!()).toBe('test2');
  expect(store.getters['testModule/test']).toBe('test2');
  expect(module.test).toBe('test2');

  delete config.store;

  expect(propertiesToDefine.test.get!()).toBeUndefined();
  /**
   * this should still be 'test2' because the fallback to $store should be used
   * when config.store is not available
   */
  expect(store.getters['testModule/test']).toBe('test2');
  expect(module.test).toBeUndefined();
});

test('should generate static actions correctly', async () => {
  const { store, module } = storeFactory();
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticActions(stores.testModule, propertiesToDefine);
  expect(propertiesToDefine).toEqual({
    fetchTest: {
      value: expect.any(Function),
    },
  });

  let val = await propertiesToDefine.fetchTest.value({ test1: 'hello' });
  expect(val).toBeTruthy();
  expect(store.getters['testModule/test']).toBe('hello');
  expect(module.test).toBe('hello');

  val = await module.fetchTest({ test1: 'world' });
  expect(val).toBeTruthy();
  expect(store.getters['testModule/test']).toBe('world');
  expect(module.test).toBe('world');

  delete config.store;

  val = await module.fetchTest({ test1: 'world' });
  expect(val).toBeUndefined();
  /**
   * this should still be 'world' because the fallback to $store should be used
   * when config.store is not available
   */
  expect(store.getters['testModule/test']).toBe('world');
  expect(module.test).toBeUndefined();
});

test('should generate static properties for nested modules', async () => {
  @VuexClass
  class NestedModule extends VuexModule {
    private moduleName = 'nestedModule';
    test = 'test';
  }

  @VuexClass
  class TestModule extends VuexModule {
    private moduleName = 'testModule';
    @Nested(NestedModule) nestedModule = new NestedModule();
  }

  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticNestedProperties(stores.testModule, propertiesToDefine);
  expect(propertiesToDefine).toEqual({
    nestedModule: {
      get: expect.any(Function),
    },
  });
});

test('calls on nested module should work correctly', () => {
  const { module, module2 } = storeFactory();
  expect(module.nestedModule.test).toBe('test');
  expect(module2.nestedModule.test).toBe('test');
});

test('should guard static props when store is not passed to config', async () => {
  const { module } = storeFactory(false);
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticStates(stores.testModule, propertiesToDefine);
  generateStaticGetters(stores.testModule, propertiesToDefine);
  generateStaticMutations(stores.testModule, propertiesToDefine);
  generateStaticActions(stores.testModule, propertiesToDefine);

  expect(module.testState).toBeUndefined();

  expect(module.test).toBeUndefined();

  module.test = 'bla';
  expect(module.test).toBeUndefined();

  module.setTest('bla');
  expect(module.test).toBeUndefined();

  const val = await module.fetchTest({ test1: 'world' });
  expect(val).toBeUndefined();
  expect(module.test).toBeUndefined();
});

test('path should be constructed correctly', () => {
  let path = constructPath('parent', 'child', 'test', true);
  expect(path).toBe('parent/child/test');

  path = constructPath('parent', 'child', 'test', false);
  expect(path).toBe('parent/test');

  path = constructPath('parent', 'child', '', true);
  expect(path).toBe('parent/child');

  path = constructPath('parent', 'child', '', false);
  expect(path).toBe('parent');

  path = constructPath();
  expect(path).toBe('');
});
