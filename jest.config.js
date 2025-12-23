// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   roots: ['<rootDir>/tests'],
//   testMatch: ['**/*.test.ts'],
//   setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
//   moduleNameMapper: {
//     '^(\\.{1,2}/.*)\\.js$': '$1',
//   },
//   transform: {
//     '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
//   },
//   collectCoverageFrom: [
//     'src/**/*.ts',
//     '!src/**/*.d.ts',
//   ],
//   // Control Jest verbosity based on DEBUG (set via environment variable or config)
//   verbose: false,
//   silent: process.env.DEBUG !== 'true',
// };
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  verbose: false,
};


