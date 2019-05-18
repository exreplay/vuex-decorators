import commonjs from 'rollup-plugin-commonjs' ;
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const plugins = [
    commonjs(),
    babel({
        runtimeHelpers: true,
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs'],
        babelrc: false,
        presets: [['@babel/preset-env', { modules: false }]],
    })
];
const minPlugins = [
    ...plugins,
    terser()
]

const esm = {
    input: 'src/index.js',
    output: {
        format: 'esm',
        file: 'dist/vuex-decorators.js'
    },
    external: [ 'vue' ],
    plugins
};

const esmMin = JSON.parse(JSON.stringify(esm));
esmMin.output.file = 'dist/vuex-decorators.min.js';
esmMin.plugins = minPlugins

const cjs = {
    input: 'src/index.js',
    output: {
        format: 'cjs',
        name: 'VuexDecorators',
        file: 'dist/vuex-decorators.cjs.js'
    },
    external: [ 'vue' ],
    plugins 
};

const cjsMin = JSON.parse(JSON.stringify(cjs));
cjsMin.output.file = 'dist/vuex-decorators.cjs.min.js';
cjsMin.plugins = minPlugins

export default [
    esm,
    esmMin,
    cjs,
    cjsMin
];