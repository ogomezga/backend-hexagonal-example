module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\/tsx?$': 'ts-jest',
    },
    testRegex: '(/_tests_/.*|(\\.|/)(test|spec))\\.tsx?$',
    testPathIgnorePatterns: ['/node_modules/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironments: 'node',
    globalSetup: '<rootDir>/src/test/test-helpers/global-setup.ts',
    globalTeardown: '<rootDir>/src/test/test-helpers/global-teardown.ts',
    coverageDirectory: '<rootDir>/coverage',
    coverageProvider: 'babel',
    clearMocks: true,
    testTimeout: 15000,
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    }
}