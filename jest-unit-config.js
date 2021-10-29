const config = require('./jest.config')
config.testMatch = ['**/*.spec.ts']
config.maxWorkers = 6
config.displayName = {
  color: 'magenta',
  name: 'UNIT'
}
module.exports = config
