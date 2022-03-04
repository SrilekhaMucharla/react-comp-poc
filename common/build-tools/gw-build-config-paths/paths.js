const path = require('path');
const fs = require('fs');
const url = require('url');
const glob = require('fast-glob');
const normalizePath = require('normalize-path');
const sp = require('synchronized-promise');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
    const hasSlash = inputPath.endsWith('/');
    if (hasSlash && !needsSlash) {
        return inputPath.substr(0, inputPath.length - 1);
    } if (!hasSlash && needsSlash) {
        return `${inputPath}/`;
    }
    return inputPath;
}

// eslint-disable-next-line import/no-dynamic-require,global-require
const getPublicUrl = (appPackageJson) => envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
    const publicUrl = getPublicUrl(appPackageJson);
    const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find((fileExtension) => fs.existsSync(resolveFn(`${filePath}.${fileExtension}`)));

    if (extension) {
        return resolveFn(`${filePath}.${extension}`);
    }

    return resolveFn(`${filePath}.js`);
};

const resolveGlob = async (globExpr, basePath) => {
    const matchingPaths = await glob(globExpr, { cwd: normalizePath(basePath) });
    const realPaths = matchingPaths.map((p) => path.resolve(basePath, p));
    return realPaths;
};

const getGlob = (globExpressions, basePath) => {
    const resolvePathsFn = () => resolveGlob(globExpressions, basePath);
    const resolvePathsSync = sp(resolvePathsFn, { timeouts: 3600 * 1000 });
    const resolvedPaths = resolvePathsSync();
    return resolvedPaths;
};

const appPath = resolveApp('.');
const translationRoot = 'src/generated/translation';
const rootPath = path.join(appPath, '..', '..');
const nvmrcPath = path.join(rootPath, '.nvmrc');

module.exports = {
    dotenv: resolveApp('.env'),
    appPath: appPath,
    appBuild: resolveApp('build'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appGeneratedConfig: resolveApp('src/generated/config.json'),
    appMetadata: resolveApp('src/generated/metadata'),
    appTranslationRoot: resolveApp(translationRoot),
    appTranslation: resolveApp('src/i18n'),
    backendTranslations: resolveApp(`${translationRoot}/backend-translations`),
    frontendTranslations: resolveApp(`${translationRoot}/frontend-translations`),
    appProductMetadata: resolveApp('src/generated/metadata/product-metadata.json'),
    appConfig: resolveApp('src/config'),
    appCustomerConfig: resolveApp('src/config/config.json5'),
    faqConfig: resolveApp('src/config/FaqConfig.json'),
    appQuestionSetsMetadata: resolveApp('src/generated/metadata/questionSets-metadata.json'),
    appBuildConfig: resolveApp('config/build.config.js'),
    appAssets: resolveApp('src/assets'),
    appIndexJs: resolveModule(resolveApp, 'src/index'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    appTsConfig: resolveApp('tsconfig.json'),
    yarnLockFile: resolveApp('yarn.lock'),
    testsSetup: resolveModule(resolveApp, 'src/setupTests'),
    proxySetup: resolveApp('src/setupProxy.js'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: getServedPath(resolveApp('package.json')),
    gwModules: getGlob(['common/*/gw-*/**', 'common/*/hastings-*/**', '!**/node_modules'], rootPath),
    customerPath: resolveApp('src/customer'),
    browserBlocking: resolveApp('src/browserBlocking.js'),
    moduleResolution: resolveApp('src/generated/module-resolution.json'),
    nvmrcPath
};


module.exports.moduleFileExtensions = moduleFileExtensions;
