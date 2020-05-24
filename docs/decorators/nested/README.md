# Nested

The `@Nested` decorator can be used on any property, is automatically marked as nested module in the given class and passed to the `modules` object later when using `ExportVuexStore`. There are a few things you need to think about when using it:

- Always pass a new instance of the class which should be nested
- The property name does not have to match the moduleName of the nested module
- You can set `namespaced` to `false` in the nested class if you want to inherit the namespace from the parent module

::: warning
When using Babel, pass the class to the decorator as argument, otherwise we can`t figure out the property name of the nested module.
:::

```typescript
@VuexClass
class NestedModule extends VuexModule {
  private moduleName = 'nested';
  test = 'hello world from NestedModule!';
}

@VuexClass
class Test {
  private moduleName = 'test';
  test = 'hello world from TestModule!';
  
  @Nested() nestedModule = new NestedModule();
  // Babel
  @Nested(NestedModule) nestedModule = new NestedModule();
}
```

this is turned into the equivalent

```typescript
{
  state() {
    return {
      test: 'hello world from TestModule!'
    }
  },
  modules: {
    nested: {
      namespaced: true,
      state() {
        return {
          test: 'hello world from NestedModule!'
        }
      }
    }
  }
}
```

The reason why you have to pass a new instance of the nested module is for typings to work correctly. By doing that, your IDEs intellisense would give you the correct properties which can be called. This is how you would access your nested modules.

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
            return this.$store.getters['test/nested/test'];
            // or
            return TestModule.nestedModule.test;
        }
    }
</script>
```