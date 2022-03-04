/** defines the files under test */
const testMatch = [
    '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/**/?(*.)(spec|test).{js,jsx,ts,tsx}',
];
const testPathIgnorePatterns = ['/node_modules/', '__mocks__'];
const rootDir = process.cwd();

let additionalModules = {};
if (rootDir.endsWith('quote-and-buy')) {
    additionalModules = {
        '^app-config$': '<rootDir>src\\generated\\config.json',
        '^product-metadata$': '<rootDir>src\\generated\\metadata\\product-metadata.json',
        '^hastings-components$': '<rootDir>..\\..\\common\\modules-react\\hastings-components\\index.js',
        'spinnerAnimationData.json': '<rootDir>..\\..\\__mocks__\\spinnerAnimationData.json'
    };
} else if (rootDir.endsWith('components')) {
    // TODO: this needs to be changed in next sprint as Part II
    // TODO: HDForm should be moved to QnB App as an integration layer
    additionalModules = {
        '^app-config$': '<rootDir>..\\..\\..\\applications\\quote-and-buy\\src\\generated\\config.json',
        '^product-metadata$': '<rootDir>..\\..\\..\\applications\\quote-and-buy\\src\\generated\\metadata\\product-metadata.json',
        'spinnerAnimationData.json': '<rootDir>..\\..\\..\\__mocks__\\spinnerAnimationData.json'
    };
} else { // assume rootDir is root project directory
    additionalModules = {
        '^product-metadata$': '<rootDir>applications\\quote-and-buy\\src\\generated\\metadata\\product-metadata.json',
        'spinnerAnimationData.json': '<rootDir>__mocks__\\spinnerAnimationData.json'
    };
}

module.exports = {
    displayName: 'test',
    verbose: true,
    rootDir,
    resolver: require.resolve('jest-pnp-resolver'),
    setupFiles: ['react-app-polyfill/jsdom', 'jest-canvas-mock'],
    setupFilesAfterEnv: [require.resolve('./jest/setupTests')],
    testMatch,
    testPathIgnorePatterns,
    testEnvironment: 'jsdom',
    testURL: 'http://localhost',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': require.resolve('babel-jest'),
        '^.+\\.json5$': require.resolve('json5-jest'),
        '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': require.resolve('./jest/fileTransform'),
    },
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
        '^.+\\.module\\.(css|sass|scss)$',
        'node_modules/(?!(babel-jest)/)',
    ],
    moduleNameMapper: {
        '^react-native$': 'react-native-web',
        '^.+(\\.module)?\\.(css|sass|scss)$': 'identity-obj-proxy',
        '^.+\\.messages.js$': 'identity-obj-proxy',
        ...additionalModules
    },
    moduleFileExtensions: [
        'web.js',
        'js',
        'web.ts',
        'ts',
        'web.tsx',
        'tsx',
        'json',
        'web.jsx',
        'jsx',
        'node',
    ]
};
