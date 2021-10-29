const config = require('./jest.config')
config.testMatch = ['**/integration.test.ts']
config.maxWorkers = 1
module.exports = config
