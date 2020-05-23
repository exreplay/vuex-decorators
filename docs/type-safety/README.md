# Type Safety

When using the default way of accessing the vuex store, you never know eg. what type the getter returns or what payload the action accepts. Thats why we automatically create static properties on every vuex module you create which can be accessed by passing the store through the `getModule` method.

First we need a basic vuex module.

```typescript
import { VuexClass, VuexModule, Action, HasGetterAndMutation } from '@averjs/vuex-decorators';
import axios from 'axios';

@VuexClass
export default class TestStore extends VuexModule {
  moduleName = 'test';

  @HasGetterAndMutation test = 'test';

  @Action async fetchSomething({ data }) {
    const { data: { test } } = await axios({
      url: `test`,
      method: 'GET',
      data
    });

    this.$store.commit('test', test);
  }
}

```

What happens internally is that the `@VuexClass` decorator modifies the class by defining all the decorated properties and methods as static properties. For example the `fetchSomething` action is assigned as a static `fetchSomething` method which calls `config.store.dispatch('test/fetchSomething')` and returns a promise. We can now use our module like this.

```vue
<template>
    <div>{{ test }}</div>
</template>

<script type="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import TestStore from './TestStore';
  import { getModule } from '@averjs/vuex-decorators';

  const TestModule = getModule(TestStore);

  @Component
  export default class Test extends Vue {
    get test() {
      // old way
      return this.$store.getters['test/test'];

      // new way
      return TestModule.test;
    }

    set test(val) {
      // old way
      this.$store.commit('test/test', val);

      // new way
      TestModule.test = val;
    }

    async callAction() {
      const data = new FormData();

      // old way
      await this.$store.dispatch('test/fetchSomething', { data });

      // new way
      await TestModule.fetchSomething({ data });
    }
  }
</script>
```

This feature is not limited to Typescript. It can also be used with Babel. Even though it will not give you precise typings, your IDEs intellisense will still tell you what can be called inside your vuex module.