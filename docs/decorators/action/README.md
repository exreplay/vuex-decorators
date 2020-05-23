# Action

The `@Action` decorator can be used on a method, which gets transformed into a action inside the exported vuex module. The method receives one argument, which is the payload, if there is one.

Internally the decorated method is called with a modified `this` context where all the states are mapped to the context and the actions context object is exposed through a `$store` object. You can find the context object in the official vuex getters documentation [https://vuex.vuejs.org/api/#actions](https://vuex.vuejs.org/api/#actions). The decorated action is called as a promise internally and can return one or be used with async/await.

```typescript
import { VuexClass, VuexModule, Getter } from '@averjs/vuex-decorators';
import axios from 'axios';

@VuexClass
export default class TestStore extends VuexModule {
  moduleName = 'test';

  @Action async fetchSomething(data) {
    await axios({
      method: 'GET',
      url: '/some-api/',
      data
    });
  }
}
```

this is turned into the equivalent

```typescript
{
  actions: {
    fetchSomething: async function(context, data) => {
      await axios({
        method: 'GET',
        url: '/some-api/',
        data
      });
    }
  }
}
```