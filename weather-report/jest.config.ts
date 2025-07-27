import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // --- coverage settings ---------------------------------
  collectCoverage: true,                       // always write coverage
  coverageDirectory: 'coverage',               // ⇒ ./coverage/lcov.info
  coverageReporters: ['lcov', 'text-summary'], // lcov.info + console table
  // optional: fine‑tune what counts as "code"
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',       // your source
    '!src/**/*.d.ts',          // ignore type declarations
  ],
  // -------------------------------------------------------

  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
