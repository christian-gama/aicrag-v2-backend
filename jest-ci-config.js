const config = require('./jest.config')
config.roots = ['<rootDir>/tests']
config.testMatch = ['!**/*.test.ts', '!**/*.spec.ts', '!**/integration.test.ts', '!**/*.steps.ts', '**/ci.test.ts']
config.maxWorkers = 1
config.displayName = {
  color: 'cyan',
  name: 'CI'
}
module.exports = config
