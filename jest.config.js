/* eslint-disable sort-keys */
module.exports = {
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/factories/**',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/schemas/**'
  ],
  modulePathIgnorePatterns: ['protocols'],
  watchPathIgnorePatterns: ['globalConfig'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  preset: '@shelf/jest-mongodb',
  maxWorkers: 1,
  testMatch: ['**/*.steps.ts', '**/*.test.ts', '**/*.spec.ts', '!**/integration.test.ts'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1'
  }
}
