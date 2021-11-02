/* eslint-disable sort-keys */
module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/**/*.test.ts',
    '!<rootDir>/src/**/*.steps.ts',
    '!<rootDir>/src/factories/**',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/adapters/**',
    '!<rootDir>/src/schemas/**'
  ],
  modulePathIgnorePatterns: ['protocols'],
  watchPathIgnorePatterns: ['globalConfig'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  preset: '@shelf/jest-mongodb',
  maxWorkers: 1,
  testMatch: ['**/*.steps.ts', '**/*.test.ts', '**/*.spec.ts', '!**/integration.test.ts', '!**/ci.test.ts'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1'
  }
}
