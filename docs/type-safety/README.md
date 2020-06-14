# Type Safety

::: warning
Everything shown below assumes that you passed the final store to `config.store`. You can see how it is done [here](/api/config/#store).
:::

## How to use it

When using the default way of accessing the vuex store, you never know eg. what type the getter returns or what payload the action accepts. Thats why we automatically create static properties on every vuex module you create and pass through the `ExportVuexStore` function, which can be accessed by passing the store through the `getModule` method.

First we need a basic vuex module.

```typescript
import { VuexClass, VuexModule, Action, HasGetterAndMutation } from '@averjs/vuex-decorators';
import axios from 'axios';

@VuexClass
export default class TestStore extends VuexModule {
  private moduleName = 'test';

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

## `this` context

In the example above, you can see that inside the action, in order to mutate a state, we used `this.$store`. This elminiates typings and can be prone to errors. To make DX even better, you can call every action, mutation, ... by using `this`, like you would do in a normal class. This also works with nested stores. The example above could look something like this.

```typescript{40,41,42,43,44,54,56}
import {
  VuexClass,
  VuexModule,
  Action,
  HasGetterAndMutation,
  Nested,
  Mutation,
  Getter
} from '@averjs/vuex-decorators';
import axios from 'axios';

@VuexClass
class NestedStore extends VuexModule {
  private moduleName = 'nested';
  nestedState = 'nested';

  get lazyNestedState() { return this.nestedState; }
}

@VuexClass
export default class TestStore extends VuexModule {
  private moduleName = 'test';

  @Nested() nested = new NestedStore();

  @HasGetterAndMutation test = 'test';

  get lazyTest() { return this.test }
  set lazyTest(val) { this.test = val; }

  @Getter getTest() {
    return this.test;
  }

  @Mutation setTest(val) {
    this.test = val;
  }

  @Action async anotherAction() {
    this.setTest('hello');
    console.log(this.getTest());
    this.lazyTest = 'world';
    console.log(this.lazyTest);
    console.log(this.nested.lazyNestedState);
  }

  @Action async fetchSomething({ data }) {
    const { data: { test } } = await axios({
      url: `test`,
      method: 'GET',
      data
    });

    this.test = test;

    await this.anotherAction();
  }
}
```

You can see that everything is callable as it was defined. Eg. the `@Getter` was defined as a function and can be called like that.

One thing you still have to keep in mind is that, we still follow the recommended vuex way. That means, you can only call the stuff that would be passed as context.

For `getters`:
- state
- getters

For `actions`:
- state
- mutations
- getters
- actions

## root access

`actions` and `getters` both are having access to `rootState` and `rootGetters`. When you decide you want to go with the complete `Type Safe` way and also not using `this.$store` inside the module classes, it would be a bummer if you would have to use `this.$store` only to access root stuff. To solve that problem, you dont need to learn anything new, just import the store classes you passed through the `getModule` function and call it inside your actions or wherever you want.

```typescript
import { VuexClass, VuexModule, HasGetterAndMutation, getModule } from '@averjs/vuex-decorators';
import axios from 'axios';

@VuexClass
export default class AnyStore extends VuexModule {
  private moduleName = 'anyStore';
  @HasGetterAndMutation test = 'hello world';
}

export const AnyModule = getModule(AnyStore);
```

```typescript
import { VuexClass, VuexModule, Action, HasGetterAndMutation } from '@averjs/vuex-decorators';
import { AnyModule } from './AnyStore';

@VuexClass
export default class TestStore extends VuexModule {
  private moduleName = 'test';

  @HasGetterAndMutation test = 'test';

  @Action async fetchSomething() {
    this.test = AnyModule.test;
  }
}
```
