# Vuex Decorators

<p align="center">
    <a href="https://www.npmjs.com/package/@averjs/vuex-decorators"><img src="https://badgen.net/npm/v/@averjs/vuex-decorators?icon=npm" alt="Version"></a>
    <img src="https://img.shields.io/npm/dm/@averjs/vuex-decorators.svg" alt="Downloads"></a>
    <a href="https://circleci.com/gh/exreplay/averjs-vuex-decorators"><img src="https://circleci.com/gh/exreplay/averjs-vuex-decorators.svg?style=shield" alt="CircleCi"></a>
    <a href="https://codecov.io/gh/exreplay/averjs-vuex-decorators"><img src="https://codecov.io/gh/exreplay/averjs-vuex-decorators/branch/development/graph/badge.svg" alt="Codecov"></a>
</p>

> Be aware that this package only supports Vuex Modules.

Thanks to Decorators in Typescript and Babel, we are able to transform the boring old way of writing Vuex into something way better.

## Installation

To install the package use one of the following commands:

```bash
npm install @averjs/vuex-decorators
# OR
yarn add @averjs/vuex-decorators
```

### Babel

In order for the Decorators and the classes to work, you need have a few babel plugins installed. Also keep in mind that if you want to use the `@HasGetterAndMutation`-Decorator for example, the babel plugins have to be >= 7.2.

- @babel/plugin-proposal-class-properties
- @babel/plugin-proposal-decorators

### Typescript

To make this plugin work with Typescript the only thing you have to do is to enable `experimentalDecorators` in your `tsconfig.json`.

## How it works

The best way of writing Vuex Modules with this package is to create a file for every module and export a class.

```js
// MyNewAwesomeVuexModuleFile.js
export default class MyNewAwesomeVuexModuleFile {

}
```

Now in order for Vuex to understand what happens in the class you exported, you need to add a few Decorators. You can import them individually but the most important one is `@VuexClass`, because it initializes the module. The package is also built with `Module Reuse` in mind. That means that every module state is returning a function to avoid cross module pollution.

Every class also has to have a `moduleName` variable. This should be the identifier which you want to use in Vuex to access the module.

```js
// MyNewAwesomeVuexModuleFile.js
import { VuexClass } from '@averjs/vuex-decorators';

@VuexClass
export default class MyNewAwesomeVuexModuleFile {
    moduleName = 'myAwesomeVuexModule';
}
```

Every function is getting called internally by using the `call() method`. That lets you call the states by using `this`. To keep calling `dispatch` and `commit` familiar with the typical vue notation, you can use `this.$store` inside your actions or getters. For Typescript there is a class called `VuexModule`, which you can import and extend from to provide you with typings for `this.$store`. You can find what can be called by `this.$store` by referring to the Vuex documentation.

- https://vuex.vuejs.org/api/#actions
- https://vuex.vuejs.org/api/#getters

```js
// MyNewAwesomeVuexModuleFile.js
import { VuexClass, Action, HasGetterAndMutation, /* typescript */ VuexModule } from '@averjs/vuex-decorators';

@VuexClass
export default class MyNewAwesomeVuexModuleFile /* typescript */ extends VuexModule {
    moduleName = 'myAwesomeVuexModule';

    @HasGetterAndMutation variable = 'awesome';

    get getAwesomeVariable() {
        return this.variable;
    }

    set setAwesomeVariable(payload) {
        this.variable = payload;
    }

    @Action awesomeAction(test) {
        this.$store.commit('variable', test);
    }
}
```

### Decorators

- @VuexClass 
- @Getter
- @HasGetter
- @Mutation
- @HasGetterAndMutation
- @Action
- @ExportVuexStore

## Example

### Vuex file
```js
import { VuexClass, Action, Getter, Mutation, HasGetterAndMutation } from '@averjs/vuex-decorators';
import axios from 'axios';
import map from 'lodash/map';

@VuexClass
export default class TestStore {
    moduleName = 'test';

    test = 'test';

    // generates getter and mutation with name of variable
    @HasGetterAndMutation testArray = [];

    // generates getter
    get getTest() {
        return map(this.test, test => test = '');
    }

    // generates mutation
    set setTest(payload) {
        this.test = payload
    }

    // another way of defining a getter
    @Getter getterTest() {
        return map(this.test, test => test = '');
    }

    // another way of defining a mutation
    @Mutation mutationTest(payload) {
        this.test = payload;
    }

    @Action async fetchTest() {
        try {
            const { data } = await axios({
                url: `test`,
                method: 'GET'
            });

            this.$store.commit('setTest', data.test);
        } catch (err) {
            throw err;
        }
    }
}

```

### Usage with Vuex
```js
import Vuex from 'vuex';
import { ExportVuexStore } from '@averjs/vuex-decorators';
import VuexFile from './VuexFile.js';

const vuexFile = ExportVuexStore(VuexFile);

new Vuex.Store({
    modules: {
        [vuexFile.moduleName]: vuexFile
    }
});
```

## ToDo

- [ ] Create state, getter and mutation if there is a getter and setter named the same
- [ ] Add `@Persisted`-Decorator for `vuex-persistedstate` plugin
- [x] Better Typescript support
- [x] Use `set` for Mutations
- [x] Complete writing tests