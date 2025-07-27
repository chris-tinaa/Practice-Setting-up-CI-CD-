import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  /* ---------- coverage ------------------------------------------------ */
  collectCoverage: true,
  coverageDirectory: 'coverage',           // ⇒ ./coverage/lcov.info
  coverageReporters: ['lcov', 'text-summary'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',                      // don’t count type declarations
  ],
  /* -------------------------------------------------------------------- */

  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
