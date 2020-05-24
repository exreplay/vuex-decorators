# ExportVuexStore

Every class you decorate with `@VuexClass` is saved internally inside a `stores` object. So if you want the access the store you created just pass the class to the `ExportVuexStore` method, which returns the final object ready to be passed to vuex.

```typescript
// ./TestStore.js
import { VuexClass, VuexModule } from '@averjs/vuex-decorators';

@VuexClass
export default class TestStore extends VuexModule {
  moduleName = 'test';

  test = 'test';
}
```

```typescript
import Vuex from 'vuex';
import { config, ExportVuexStore } from '@averjs/vuex-decorators';
import TestStore from './TestStore.js';

ExportVuexStore(TestStore);
```

this would produce

```typescript
{
  namespaced: true,
  moduleName: 'test',
  state: () => {
    return {
      test: 'test'
    };
  },
  getters: {},
  actions: {},
  mutations: {},
  persistent: false
}
```

There is also a second parameter `exportAsReadyObject` which returns the same object, already keyed with the moduleName.

```typescript
ExportVuexStore(TestStore, true);

{
  test: {
    namespaced: true,
    moduleName: 'test',
    state: () => {
      return {
        test: 'test'
      };
    },
    getters: {},
    actions: {},
    mutations: {},
    persistent: false
  }
}
```