const config = require('./jest.config')
config.testMatch = ['**/index.test.ts']
config.maxWorkers = 1
module.exports = config
