const config = require('./jest.config')
config.testMatch = ['**/*.test.ts']
config.maxWorkers = 1
module.exports = config
