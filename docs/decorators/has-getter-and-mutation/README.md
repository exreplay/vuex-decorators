# HasGetterAndMutation

The `@HasGetterAndMutation` decorator can be used on any property and automatically generates the state,getter and mutation named like the property.

```typescript
import { VuexClass, VuexModule, HasGetterAndMutation } from '@averjs/vuex-decorators';

@VuexClass
export default class TestStore extends VuexModule {
  moduleName = 'test'; 
  @HasGetterAndMutation test = 'test';
}
```

this is turned into the equivalent

```typescript
{
  state() {
    return {
      test: 'test'
    }
  },
  getters: {
    test: (state) => {
      return state.test;
    }
  },
  mutations: {
    test: (state, val) => {
      state.test = val;
    }
  }
}
```