import Vue from 'vue';
import Vuex from 'vuex';
import { VuexClass, ExportVuexStore } from '../src';

Vue.use(Vuex);

test(`moduleName of TestModule should be 'testModule'`, () => {
    @VuexClass
    class TestModule {
        moduleName = 'testModule';
    }

    const tm = ExportVuexStore(TestModule);

    expect(tm.moduleName).toBe('testModule');
});

test(`vuex store has a module named 'testModule'`, () => {
    @VuexClass
    class TestModule {
        moduleName = 'testModule';
    }

    const tm = ExportVuexStore(TestModule);

    const store = new Vuex.Store({
        modules: {
            [tm.moduleName]: tm
        }
    });

    expect(Object.keys(store._modulesNamespaceMap)).toEqual(['testModule/']);
});

test(`persistent class option is getting passed to object`, () => {
    @VuexClass({ persistent: [ 'test' ] })
    class TestModule {
        moduleName = 'testModule';
    }

    const tm = ExportVuexStore(TestModule);

    expect(tm.persistent).toEqual([ 'test' ]);
});

test(`persistent class option should be false when not set`, () => {
    @VuexClass({})
    class TestModule {
        moduleName = 'testModule';
    }

    const tm = ExportVuexStore(TestModule);

    expect(tm.persistent).toBe(false);
});

test(`class should inherit from given class in extend option`, () => {
    @VuexClass
    class ExtendModule {
        moduleName = 'extendModule';
        
        extendTest = 'extendTest';

        get getExtendTest() {
            return this.extendTest;
        }
    }

    @VuexClass({ extend: [ ExtendModule ] })
    class TestModule {
        moduleName = 'testModule';
        
        test = 'test';
    }

    const tm = ExportVuexStore(TestModule);

    expect(tm.state()).toEqual({ test: 'test', extendTest: 'extendTest' });
    expect(tm.getters).toEqual({ getExtendTest: expect.any(Function) });
});

test(`store should have a getter when using get`, () => {
    @VuexClass
    class TestModule {
        moduleName = 'getterTestModule';
        test = 'test';

        get getTest() {
            return this.test;
        }
    }

    const tm = ExportVuexStore(TestModule);

    const store = new Vuex.Store({
        modules: {
            [tm.moduleName]: tm
        }
    });

    expect(tm.getters).toEqual({ getTest: expect.any(Function) });
    expect(Object.keys(store.getters)).toEqual([ 'getterTestModule/getTest' ]);
});

test(`getter should return value from test variable`, () => {
    @VuexClass
    class TestModule {
        moduleName = 'getterTestModule';
        test = 'test';

        get getTest() {
            return this.test;
        }
    }

    const tm = ExportVuexStore(TestModule);

    const store = new Vuex.Store({
        modules: {
            [tm.moduleName]: tm
        }
    });

    const test = store.getters['getterTestModule/getTest'];
    expect(test).toBe('test');
});