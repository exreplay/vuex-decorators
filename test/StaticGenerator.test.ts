import Vuex, { Store } from 'vuex';
import {
  VuexClass,
  ExportVuexStore,
  Mutation,
  HasGetterAndMutation,
  Action,
  VuexModule,
  Getter,
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
} from '../src/decorators/StaticGenerators';

interface PayloadInterface {
  test1: string;
  test2?: string[];
}

@VuexClass
class TestModule extends VuexModule {
  private moduleName = 'testModule';

  @HasGetterAndMutation public test = 'test';

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

  @Action public async fetchTest(payload: PayloadInterface): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.$store.commit('setTest', payload.test1);
    return true;
  }
}

let module: TestModule;
let store: Store<any>;
const localVue = createLocalVue();
localVue.use(Vuex);

beforeEach(() => {
  const testModule = ExportVuexStore(TestModule);

  store = new Vuex.Store({
    modules: {
      [testModule.moduleName as string]: testModule,
    },
  });

  config.store = store;

  module = getModule(TestModule);
});

function wrapperFactory() {
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
  const component = wrapperFactory();
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
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticStates(stores.testModule, propertiesToDefine);
  expect(JSON.stringify(propertiesToDefine)).toEqual(
    JSON.stringify({
      test: {
        get() {},
      },
    })
  );

  expect(propertiesToDefine.test.get!()).toBe('test');
  expect(module.test).toBe('test');
});

test('should generate static getters correctly', () => {
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
  const propertiesToDefine: PropertiesToDefine = {};
  generateStaticGetters(stores.testModule, propertiesToDefine);
  generateStaticMutations(stores.testModule, propertiesToDefine);

  propertiesToDefine.test.set!('test2');
  expect(propertiesToDefine.test.get!()).toBe('test2');
  expect(store.getters['testModule/test']).toBe('test2');
  expect(module.test).toBe('test2');
});

test('should generate static actions correctly', async () => {
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
