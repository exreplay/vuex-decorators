# Getter

The `@Getter` decorator can be used on a method, which gets transformed into a getter inside the exported vuex module. You can also use a standard getter method instead of the decorator.

Internally the decorated method is called with a modified `this` context. All the states are mapped to the context and every argument is exposed through a `$store` object. You can find all the arguments which are passed in the official vuex getters documentation https://vuex.vuejs.org/api/#getters.

```typescript
import { VuexClass, VuexModule, Getter } from '@averjs/vuex-decorators';

@VuexClass
export default class TestStore extends VuexModule {
  moduleName = 'test'; 

  test = 'test';

  get getTest() {
    return this.test;
  }

  // or

  @Getter getTest() {
    return this.test;
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
  getters: {
    getTest: (state) => {
      return state.test;
    }
  }
}
```