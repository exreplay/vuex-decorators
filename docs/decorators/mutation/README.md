# Mutation

The `@Mutation` decorator can be used on a method, which gets transformed into a mutation inside the exported vuex module. You can also use a standard setter method instead of the decorator. The method receives one argument, which is the payload, if there is one.

Internally the decorated method is called with a modified `this` context where all the states are mapped to it.

```typescript
import { VuexClass, VuexModule, Getter } from '@averjs/vuex-decorators';

@VuexClass
export default class TestStore extends VuexModule {
  moduleName = 'test'; 

  test = 'test';

  set setTest(val) {
    this.test = val;
  }

  // or

  @Mutation setTest(val) {
    this.test = val;
  }
}
```

both ways are turned into the equivalent

```typescript
{
  state() {
    return {
      test: 'test'
    }
  },
  mutations: {
    setTest: (state, val) => {
      state.test = val;
    }
  }
}
```