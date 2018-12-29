import { VuexClass, ExportVuexStore } from '../src';

@VuexClass
class TestModule {
    moduleName = 'testModule';
}

test(`check if object is a valid vuex object`, () => {
    const tm = ExportVuexStore(TestModule);
    expect.objectContaining({
        namespace: true,
        state: expect.any(Function),
        getters: expect.any(Object),
        actions: expect.any(Object),
        mutations: expect.any(Object),
        moduleName: 'testModule'
    })
})

test(`tm should be plain object with moduleName prop`, () => {
    const tm = ExportVuexStore(TestModule);
    expect(tm.moduleName).toBe('testModule');
});

test(`tm object should have a key like the moduleName`, () => {
    const tm = ExportVuexStore(TestModule, true);
    expect(Object.keys(tm)).toEqual([ 'testModule' ]);
});