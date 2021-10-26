const config = require('./jest.config')
config.testMatch = ['**/*.steps.ts']
config.maxWorkers = 4
module.exports = config
