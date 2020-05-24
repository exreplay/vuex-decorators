# Config

The config object.

```ts
import { config } from '@averjs/vuex-decorators';
```

## Options

### store

- Type: `Store`
- Default: `undefined`

This parameter is necessary if you want to use the [Type Safe](/type-safe/) way of accessing your vuex modules. It accepts the final store object.

```typescript {13}
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