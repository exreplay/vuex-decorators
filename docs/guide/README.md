# Getting started

## Introduction

Writing a vuex store can become confusing very fast. When a project gets bigger and a whole team is working on it, the store can be become hard to read and maintain.

Thanks to Decorators in Typescript and Babel, we are able to transform the boring old way of writing Vuex into something way better, type safe and more maintainable.

## Transpiler Setup

Before we can start writing our class based vuex stores we need to setup our transpiler in order for them to understand what we want.

### Babel

In order for the Decorators and the classes to work, you need have a few babel plugins installed. Also keep in mind that if you want to use the `@HasGetterAndMutation`-Decorator for example, the babel plugins have to be >= 7.2.

- @babel/plugin-proposal-class-properties
- @babel/plugin-proposal-decorators

### Typescript

To make this plugin work with Typescript the only thing you have to do is to enable `experimentalDecorators` in your `tsconfig.json`.

## Installation and Setup

To install the package use one of the following commands:

```bash
npm install @averjs/vuex-decorators
# OR
yarn add @averjs/vuex-decorators
```

When we are done installing, we can create our first very basic class by creating a file with the following content.

```typescript
// ./TestStore.js
import { VuexClass, VuexModule } from '@averjs/vuex-decorators';

@VuexClass
export default class TestStore extends VuexModule {
  moduleName = 'test'; 

  test = 'test';

  get getTest() {
    return this.test;
  }
}
```

Now in order for Vuex to understand what happens in the class you exported, we need to pass it to the `ExportVuexStore` function and the returned object to the vuex store.

```js
import Vuex from 'vuex';
import { config, ExportVuexStore } from '@averjs/vuex-decorators';
import TestStore from './TestStore.js';

const test = ExportVuexStore(TestStore);

const store = new Vuex.Store({
    modules: {
        [test.moduleName]: test
    }
});

config.store = store;
```

Now you are able to work with your module in 2 ways. The traditional way by calling `this.$store` or you can also make use of a type safe way like shown below. Dont forget to pass the final store object to the config like described [here](/api/config/#store). You can read more about it in the [Type Safety](/type-safety/) section.

```vue
<template>
    <div>{{ test }}</div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { getModule } from '@averjs/vuex-decorators';
    import Module from './TestModule.ts';
    const TestModule = getModule(Module);

    @Component
    export default class Test extends Vue {
        get test() {
            return TestModule.getTest;
        }
    }
</script>
```

