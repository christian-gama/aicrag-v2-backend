// Configuração dos arquivos .test (teste de integração)

const config = require('./jest.config')
config.testMatch = ['**/*.test.ts']
module.exports = config
