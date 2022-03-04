
const reactIntlPlugin = [
    'react-intl',
    {
        messagesDir: './src/generated/translation/partials'
    }
];

const defaultPlugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
    [
        'babel-plugin-named-asset-import',
        {
            loaderMap: {
                svg: {
                    ReactComponent: '@svgr/webpack?-svgo,+ref![path]',
                },
            },
        },
    ],
];

function getPlugins() {
    switch (process.env.BABEL_ENV) {
        case 'production':
            return [
                reactIntlPlugin,
                ...defaultPlugins
            ];
        case 'test':
            return defaultPlugins;
        case 'development':
            return [
                reactIntlPlugin,
                ...defaultPlugins
            ];
        default:
            return defaultPlugins;
    }
}

module.exports = (api) => {
    api.cache.using(() => process.env.BABEL_ENV);
    const isTesting = process.env.BABEL_ENV === 'test';
    return {
        presets: [
            [
                '@babel/env',
                { modules: isTesting ? 'commonjs' : 'auto' }
            ],
            '@babel/preset-react',
        ],
        sourceMaps: isTesting && false,
        babelrcRoots: [
            '.',
            'applications/**',
            'common/**',
        ],
        plugins: getPlugins()
    };
};
