# VuexModule

If you are writing your stores in typescript, you need to make sure you extend every class with `VuexModule`. This ensures that calling `$store` inside a getter or action does not produce an error. The `$store` property is typed with the `ActionContext` so keep in mind when you use it in a getter, you might get suggestions which are not available. Not the most elegant way but still better than `any`.

You can find every context which is passed to `$store` here:
- [https://vuex.vuejs.org/api/#getters](https://vuex.vuejs.org/api/#getters)
- [https://vuex.vuejs.org/api/#actions](https://vuex.vuejs.org/api/#actions)

```typescript
import { VuexClass, VuexModule } from '@averjs/vuex-decorators';

@VuexClass
export default class TestStore extends VuexModule {
  moduleName = 'test';

  @Action async test() {
    // When leaving out VuexModule, this would produce an error in typescript.
    this.$store.commit();
  }
}
```
