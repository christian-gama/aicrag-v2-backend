const config = require('./jest.config')
config.testMatch = ['**/*.spec.ts']
config.maxWorkers = 4
module.exports = config
