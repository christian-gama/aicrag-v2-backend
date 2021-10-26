const config = require('./jest.config')
config.testMatch = ['**/*.steps.ts']
config.maxWorkers = 1
module.exports = config
