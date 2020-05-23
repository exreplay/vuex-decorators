# VuexClass

This is the only class decorator and is necessary. Internally this decorator assigns all the states and static properties.

```typescript {3}
import { VuexClass, VuexModule } from '@averjs/vuex-decorators';

@VuexClass
export default class TestStore extends VuexModule {
  moduleName = 'test';
}
```

## Options

An `object` with the following options can be passed.

```typescript {4-8}
import { VuexClass, VuexModule } from '@averjs/vuex-decorators';
import AnyStore from './AnyStore';

@VuexClass({
  namespaced: false,
  extend: [AnyStore],
  persistent: ['test']
})
export default class TestStore extends VuexModule {
  moduleName = 'test';
  test = 'test';
}
```

### persistent

- Type: `array`
- Default: `string[]`

This passes all the states to the final module object. When exporting the store with `ExportVuexStore`, this array will be right there for you to process.

### extend

- Type: `array`
- Default: `any[]`

Every state, getter, mutation or action of the classes passed to the extend array are getting merged. You can pass any number of decorated classes to this array.

### namespaced

- Type: `boolean`
- Default: `true`

This sets the `namespaced` prop for the module.