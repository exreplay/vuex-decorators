import Vue from 'vue';
import Vuex from 'vuex';
import { VuexClass, ExportVuexStore, Action, HasGetterAndMutation } from '../src';

Vue.use(Vuex);

@VuexClass
class TestModule {
    moduleName = 'testModule';
    @HasGetterAndMutation test = 'test';
    @Action test() {}
    @Action testMutation() { this.$store.commit('test', 'testModified'); }
}

const tm = ExportVuexStore(TestModule);

const store = new Vuex.Store({
    modules: {
        [tm.moduleName]: tm
    }
});

test(`check if action exists and is a function`, () => {
    expect(tm.actions).toEqual({ test: expect.any(Function), testMutation: expect.any(Function) });
});

test(`the action is present in the vuex store object`, () => {
    expect(Object.keys(store._actions)).toEqual([ 'testModule/test', 'testModule/testMutation' ]);
});

test(`dispatching the 'testMutation' action mutates the test state to 'testModified'`, async () => {
    await store.dispatch('testModule/testMutation');
    expect(store.state.testModule.test).toBe('testModified');
});