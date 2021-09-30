const config = require('./jest.config')
config.testMatch = ['**/*.spec.ts']
config.maxWorkers = 6
module.exports = config
