module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        targets: {
          browsers: '> 0.5%, ie >= 9'
        }
      }
    ]
  ],
  plugins: [
    [ '@babel/plugin-proposal-decorators', { legacy: true } ],
    [ '@babel/proposal-class-properties', { loose: true } ]
  ]
};
