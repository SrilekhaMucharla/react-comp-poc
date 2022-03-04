const baseConfig = require('./common/build-tools/gw-build-config-eslint');

module.exports = {
    ...baseConfig,
    rules: {
        ...baseConfig.rules,
        'react-hooks/exhaustive-deps': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.js', '**/*.test.jsx', '**/__helpers__/test/*'] }]
    },
};
