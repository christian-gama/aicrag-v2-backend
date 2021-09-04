module.exports = {
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  modulePathIgnorePatterns: ['protocols'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1',
    '@/domain/(.*)': '<rootDir>/src/domain/$1',
    '@/application/(.*)': '<rootDir>/src/application/$1',
    '@/infra/(.*)': '<rootDir>/src/infra/$1',
    '@/main/(.*)': '<rootDir>/src/main/$1',
    '@/presentation/(.*)': '<rootDir>/src/presentation/$1'
  }
}
