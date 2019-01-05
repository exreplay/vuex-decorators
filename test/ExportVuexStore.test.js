import { VuexClass, ExportVuexStore } from '../src';

@VuexClass
class TestModule {
    moduleName = 'testModule';
}

test(`check if object is a valid vuex object`, () => {
    const tm = ExportVuexStore(TestModule);
    const obj = {
        namespaced: true,
        getters: {},
        actions: {},
        mutations: {},
        moduleName: 'testModule'
    };
    expect(JSON.stringify(tm)).toEqual(JSON.stringify(obj));
    expect(tm.state).toEqual(expect.any(Function));
})

test(`tm should be plain object with moduleName prop`, () => {
    const tm = ExportVuexStore(TestModule);
    expect(tm.moduleName).toBe('testModule');
});

test(`tm object should have a key like the moduleName`, () => {
    const tm = ExportVuexStore(TestModule, true);
    expect(Object.keys(tm)).toEqual([ 'testModule' ]);
});