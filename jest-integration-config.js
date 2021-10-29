const config = require('./jest.config')
config.testMatch = ['**/integration.test.ts']
config.maxWorkers = 1
config.verbose = true
config.displayName = {
  color: 'blue',
  name: 'INTEGRATION'
}
module.exports = config
