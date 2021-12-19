const config = require('./jest.config')
config.testMatch = ['!**/*.steps.ts', '!**/*.test.ts', '**/*.spec.ts']
config.maxWorkers = 12
config.testEnvironment = 'node'
config.preset = undefined
config.displayName = {
  color: 'magenta',
  name: 'UNIT'
}
module.exports = config
