const {
    testMatch,
    testPathIgnorePatterns,
    rootDir,
} = require('./jest-test.config');

module.exports = {
    displayName: 'lint',
    runner: 'jest-runner-eslint',
    testMatch,
    rootDir,
    testPathIgnorePatterns
};
