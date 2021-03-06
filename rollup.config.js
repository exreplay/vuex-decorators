import typescript from 'rollup-plugin-typescript2'
import { terser } from "rollup-plugin-terser";

const config = (minify = false) => ({
  input: 'src/index.ts',
  output: ['cjs', 'esm'].map(format => ({
    file: `dist/${format}/index${minify ? '.min' : ''}.js`,
    format,
    name: 'vuex-decorators',
    sourcemap: minify,
    exports: 'named'
  })),
  external: ['vue', 'vuex'],
  plugins: [
    typescript({useTsconfigDeclarationDir: true}),
    minify && terser()
  ].filter(_ => _)
});

export default [
  config(),
  config(true)
]