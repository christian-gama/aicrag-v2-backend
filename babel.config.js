/* eslint-disable sort-keys */
module.exports = {
  env: {
    development: {
      sourceMaps: 'inline',
      plugins: ['source-map-support']
    }
  },
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@/': './src',
          '@/application': './src/application',
          '@/domain': './src/domain',
          '@/factories': './src/factories',
          '@/infra': './src/infra',
          '@/main': './src/main',
          '@/presentation': './src/presentation',
          '@/schemas': './src/schemas'
        }
      }
    ]
  ],
  ignore: ['node_modules', 'tests', 'data', 'coverage', '.husky', '.vscode']
}
