module.exports = {
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
          '@/tests': './tests',
          '@/domain': './src/domain',
          '@/application': './src/application',
          '@/infra': './src/infra',
          '@/main': './src/main',
          '@/presentation': './src/presentation',
          '@/': './'
        }
      }
    ]
  ],
  ignore: ['**/*.spec.ts']
}
