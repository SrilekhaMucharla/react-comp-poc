/** Common Coverage Reporters */
const commonCoverageReporters = process.env.CI ? ['json-summary', 'html', 'lcov'] : ['text-summary', 'html'];

const watchPlugins = [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
    require.resolve('jest-runner-eslint/watch-fix')
];

const exportProjects = [require.resolve('./jest-test.config')];

module.exports = {
    rootDir: process.cwd(),
    projects: process.env.CI ? exportProjects : exportProjects.concat(require.resolve('./jest-eslint.config')),
    collectCoverage: true,
    coverageDirectory: 'reports/coverage',
    reporters: ['default', 'jest-junit'],
    coverageReporters: commonCoverageReporters,
    collectCoverageFrom: [
        'src/**/*.jsx',
        'src/**/*.js',
        'common/**/*.js',
        'common/**/*.jsx',
        'components/**/*.js',
        'components/**/*.jsx',
        'applications/**/*.jsx',
        'applications/**/*.js',
        '!**/reports/**',
        '!**/node_modules/**',
        '!**/*.config.js',
        '!**/*.messages.js',
        '!**/*.test.js',
        '!**/gw*/**',
        '!**/__mocks__/**',
        '!**/public*/**',
        '!applications/**/build/**',
        '!applications/**/dist/**',
        '!mock-server/**'
    ],
    watchPlugins
};
