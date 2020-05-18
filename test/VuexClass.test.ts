import Vue from 'vue';
import Vuex from 'vuex';
import { VuexClass, ExportVuexStore } from '../src';
import { stores } from '../src/decorators/utils';

Vue.use(Vuex);

beforeEach(() => {
  for (const store of Object.keys(stores)) delete stores[store];
});

test("moduleName of TestModule should be 'testModule'", () => {
  @VuexClass
  class TestModule {
    moduleName = 'testModule';
  }

  const tm = ExportVuexStore(TestModule);

  expect(tm.moduleName).toBe('testModule');
});

test("vuex store has a module named 'testModule'", () => {
  @VuexClass
  class TestModule {
    moduleName = 'testModule';
  }

  const tm = ExportVuexStore(TestModule);

  const store = new Vuex.Store({
    modules: {
      [tm.moduleName as string]: tm,
    },
  });

  expect(Object.keys((store as any)._modulesNamespaceMap)).toEqual([
    'testModule/',
  ]);
});

test('persistent class option is getting passed to object', () => {
  @VuexClass({ persistent: ['test'] })
  class TestModule {
    moduleName = 'testModule';
  }

  const tm = ExportVuexStore(TestModule);

  expect(tm.persistent).toEqual(['test']);
});

test('persistent class option should be undefined when not set', () => {
  @VuexClass
  class TestModule {
    moduleName = 'testModule';
  }

  const tm = ExportVuexStore(TestModule);

  expect(tm.persistent).toBeFalsy();
});

test('class should inherit from given class in extend option', () => {
  @VuexClass
  class ExtendModule {
    moduleName = 'extendModule';

    extendTest = 'extendTest';

    get getExtendTest() {
      return this.extendTest;
    }
  }

  @VuexClass({ extend: [ExtendModule] })
  class TestModule {
    moduleName = 'testModule';

    test = 'test';
  }

  const tm = ExportVuexStore(TestModule);

  expect((tm.state as Function)()).toEqual({
    test: 'test',
    extendTest: 'extendTest',
  });
  expect(tm.getters).toEqual({ getExtendTest: expect.any(Function) });
});

test('store should have a getter when using get', () => {
  @VuexClass
  class TestModule {
    moduleName = 'testModule';
    test = 'test';

    get getTest() {
      return this.test;
    }
  }

  const tm = ExportVuexStore(TestModule);

  const store = new Vuex.Store({
    modules: {
      [tm.moduleName as string]: tm,
    },
  });

  expect(tm.getters).toEqual({ getTest: expect.any(Function) });
  expect(Object.keys(store.getters)).toEqual(['testModule/getTest']);
});

test('getter should return value from test variable', () => {
  @VuexClass
  class TestModule {
    moduleName = 'testModule';
    test = 'test';

    get getTest() {
      return this.test;
    }
  }

  const tm = ExportVuexStore(TestModule);

  const store = new Vuex.Store({
    modules: {
      [tm.moduleName as string]: tm,
    },
  });

  const test = store.getters['testModule/getTest'];
  expect(test).toBe('test');
});

test('store should have a setter when using set', () => {
  @VuexClass
  class TestModule {
    moduleName = 'testModule';
    test = 'test';

    set setTest(payload: string) {
      this.test = payload;
    }
  }

  const tm = ExportVuexStore(TestModule);

  const store = new Vuex.Store({
    modules: {
      [tm.moduleName as string]: tm,
    },
  });

  expect(tm.mutations).toEqual({ setTest: expect.any(Function) });
  expect(Object.keys((store as any)._mutations)).toEqual([
    'testModule/setTest',
  ]);
});

test('set should mutate value and should be returned by getter', () => {
  @VuexClass
  class TestModule {
    moduleName = 'testModule';
    test = 'test';

    get getTest() {
      return this.test;
    }

    set setTest(payload: string) {
      this.test = payload;
    }
  }

  const tm = ExportVuexStore(TestModule);

  const store = new Vuex.Store({
    modules: {
      [tm.moduleName as string]: tm,
    },
  });
  store.commit('testModule/setTest', 'newTest');
  const test = store.getters['testModule/getTest'];
  expect(test).toBe('newTest');
});
