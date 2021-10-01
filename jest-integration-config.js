const config = require('./jest.config')
config.testMatch = ['**/*.test.ts']
config.maxWorkers = 4
module.exports = config
