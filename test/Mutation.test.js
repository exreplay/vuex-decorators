import Vue from 'vue';
import Vuex from 'vuex';
import { VuexClass, ExportVuexStore, Getter, Mutation } from '../src';

Vue.use(Vuex);

@VuexClass
class TestModule {
    moduleName = 'testModule';
    test = 'test';

    @Getter getTest() {
        return this.test;
    }

    @Mutation setTest(payload) {
        this.test = payload;
    }
}

const tm = ExportVuexStore(TestModule);

const store = new Vuex.Store({
    modules: {
        [tm.moduleName]: tm
    }
});

test(`check if mutation exists and is a function`, () => {
    expect(tm.mutations).toEqual({ setTest: expect.any(Function) });
});

test(`the mutation is present in the vuex store object`, () => {
    expect(Object.keys(store._mutations)).toEqual([ 'testModule/setTest' ]);
});

test(`calling mutation changes the value from the 'test' variable and is getting returned by getter`, () => {
    store.commit('testModule/setTest', 'newTest');
    const test = store.getters['testModule/getTest'];
    expect(test).toBe('newTest');
});