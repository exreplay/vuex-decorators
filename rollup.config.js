import typescript from 'rollup-plugin-typescript2'

export default [
  {
    input: 'src/index.ts',
    output: ['cjs', 'esm'].map(format => ({
      file: `dist/${format}/index.js`,
      format,
      name: 'vuex-decorators',
      sourcemap: true,
      exports: 'named'
    })),
    external: ['vue', 'vuex'],
    plugins: [typescript({useTsconfigDeclarationDir: true})]
  }
]