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

let module: any;
const localVue = createLocalVue();
localVue.use(Vuex);

beforeEach(() => {
  for (const store of Object.keys(stores)) delete stores[store];
});

function storeFactory(setStoreToConfig = true) {
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

  const testModule = ExportVuexStore(TestModule);
  const store = new Vuex.Store({
    modules: {
      [testModule.moduleName as string]: testModule,
    },
  });

  if (setStoreToConfig) config.store = store;
  else config.store = undefined;

  module = getModule(TestModule);

  return store;
}

function wrapperFactory<S>(store: Store<S>) {
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
          return module.testCharCountTimes2;
        },
      },
    },
    {
      localVue,
      store,
    }
  );
}

test('generated properties should be reactive', async () => {
  const store = storeFactory();
  const component = wrapperFactory(store);
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
  storeFactory();
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticStates(stores.testModule, propertiesToDefine);
  expect(JSON.stringify(propertiesToDefine)).toEqual(
    JSON.stringify({
      testState: {
        get() {},
      },
      test: {
        get() {},
      },
    })
  );

  expect(propertiesToDefine.test.get!()).toBe('test');
  expect(module.test).toBe('test');
});

test('should generate static getters correctly', () => {
  storeFactory();
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticGetters(stores.testModule, propertiesToDefine);
  expect(JSON.stringify(propertiesToDefine)).toEqual(
    JSON.stringify({
      test: {
        get() {},
      },
      testCharCountTimes2: {
        get() {},
      },
      getSetTest: {
        get() {},
      },
      testCharCount: {
        get() {},
      },
    })
  );

  expect(propertiesToDefine.test.get!()).toBe('test');
  expect(module.test).toBe('test');
  expect(propertiesToDefine.testCharCount.get!()).toBe(4);
  expect(module.testCharCount).toBe(4);
  expect(propertiesToDefine.testCharCountTimes2.get!()).toBe(8);
  expect(module.testCharCountTimes2).toBe(8);
});

test('should generate static mutations correctly', () => {
  const store = storeFactory();
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticMutations(stores.testModule, propertiesToDefine);

  expect(JSON.stringify(propertiesToDefine)).toEqual(
    JSON.stringify({
      test: {
        set() {},
      },
      setTest: {
        value() {},
      },
      getSetTest: {
        set() {},
      },
    })
  );

  propertiesToDefine.test.value!('test2');
  expect(store.getters['testModule/test']).toBe('test2');
  expect(module.test).toBe('test2');

  propertiesToDefine.setTest.value!('test3');
  expect(store.getters['testModule/test']).toBe('test3');
  expect(module.test).toBe('test3');
});

test('should generate get and set for properties with HasGetterAndMutation', () => {
  const store = storeFactory();
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticGetters(stores.testModule, propertiesToDefine);
  generateStaticMutations(stores.testModule, propertiesToDefine);

  propertiesToDefine.test.set!('test2');
  expect(propertiesToDefine.test.get!()).toBe('test2');
  expect(store.getters['testModule/test']).toBe('test2');
  expect(module.test).toBe('test2');
});

test('should generate static actions correctly', async () => {
  const store = storeFactory();
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticActions(stores.testModule, propertiesToDefine);
  expect(JSON.stringify(propertiesToDefine)).toEqual(
    JSON.stringify({
      fetchTest: {
        value() {},
      },
    })
  );

  let val = await propertiesToDefine.fetchTest.value({ test1: 'hello' });
  expect(val).toBeTruthy();
  expect(store.getters['testModule/test']).toBe('hello');
  expect(module.test).toBe('hello');

  val = await module.fetchTest({ test1: 'world' });
  expect(val).toBeTruthy();
  expect(store.getters['testModule/test']).toBe('world');
  expect(module.test).toBe('world');
});

test('should generate static properties for nested modules', async () => {
  storeFactory();
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticNestedProperties(stores.testModule, propertiesToDefine);
  expect(JSON.stringify(propertiesToDefine)).toEqual(
    JSON.stringify({
      nestedModule: {},
    })
  );

  // tslint:disable-next-line: no-empty
  const testFunction = function () {};
  Object.defineProperties(testFunction, propertiesToDefine);

  expect((testFunction as any).nestedModule.test).toBe('test');
  expect(module.nestedModule.test).toBe('test');
});

test('should guard static props when store is not passed to config', async () => {
  storeFactory(false);
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
