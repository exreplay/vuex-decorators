# HasGetter

The `@HasGetter` decorator can be used on any property and automatically generates the state and a getter named like the property.

```typescript
import { VuexClass, VuexModule, HasGetter } from '@averjs/vuex-decorators';

@VuexClass
export default class TestStore extends VuexModule {
  moduleName = 'test'; 
  @HasGetter test = 'test';
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
  }
}
```