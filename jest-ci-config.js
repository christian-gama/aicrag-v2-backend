const config = require('./jest.config')
config.testMatch = ['**/*.test.ts', '**/*.spec.ts', '!**/integration.test.ts', '**/*.steps.ts']
config.maxWorkers = 1
config.displayName = {
  color: 'cyan',
  name: 'CI'
}
module.exports = config
