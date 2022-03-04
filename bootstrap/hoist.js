const path = require('path');
const EventEmitter = require('events');
const glob = require('fast-glob');
const PromisePool = require('es6-promise-pool');
const fs = require('fs-extra');
const _ = require('lodash');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
    throw err;
});


const entryOrder = [
    'name',
    'description',
    'version',
    'projectPackagePrefixes',
    'dependencies',
    'devDependencies',
    'scripts'
];
const orderOffset = entryOrder.length + 1;
const entryIdx = (entry) => (_.indexOf(entryOrder, entry) + orderOffset) % orderOffset;

const orderPackageEntries = ([name1], [name2]) => {
    const idx1 = entryIdx(name1);
    const idx2 = entryIdx(name2);
    const diff = idx1 - idx2;
    return diff || name1.localeCompare(name2);
};

const allMonorepoPackages = new Map();
const Tracker = new EventEmitter();

const EVT_PKG_ACQUIRED = 'onPackageAcquired';
Tracker.on(
    EVT_PKG_ACQUIRED,
    ({ name, relativePath }) => allMonorepoPackages.set(name, relativePath)
);

const PACKAGES_TO_HOIST = [
    'common/**/package.json',
    'applications/**/package.json',
    'framework/**/package.json',
    '!**/node_modules'
];

async function getPackageFolder(packageFile) {
    const { name } = await fs.readJson(packageFile, { encoding: 'utf-8' });
    const packageDir = path.dirname(packageFile);
    const relativePath = path.relative(process.cwd(), packageDir).replace(/^.\//, '');
    // eslint-disable-next-line no-console
    console.log(`linking ${packageFile}`);
    Tracker.emit(EVT_PKG_ACQUIRED, {
        name,
        relativePath: `file:${relativePath}`
    });
}

async function getAllPackages() {
    const packages = await glob(PACKAGES_TO_HOIST);
    return function* getAllPackagesGen() {
        // eslint-disable-next-line no-restricted-syntax
        for (const packageFile of packages) {
            yield getPackageFolder(packageFile);
        }
        return null;
    };
}

async function editMainPackageFile() {
    const packageFile = 'package.json';
    const {
        dependencies: originalDependencies,
        projectPackagePrefixes,
        ...packageContent
    } = await fs.readJson(packageFile);

    const hasProjectPrefix = ([str]) => projectPackagePrefixes.some((pr) => str.startsWith(pr));

    const monorepoDeps = _([...allMonorepoPackages.entries()])
        .sortBy('0')
        .fromPairs()
        .value();

    const filteredOriginalDependencies = _(originalDependencies)
        .toPairs()
        .filter(hasProjectPrefix)
        .fromPairs()
        .value();

    const dependencies = {
        ...filteredOriginalDependencies,
        ...monorepoDeps
    };

    const newPackageContent = _({
        ...packageContent,
        projectPackagePrefixes,
        dependencies
    })
        .toPairs()
        .sort(orderPackageEntries)
        .fromPairs()
        .value();

    await fs.writeJson(packageFile, newPackageContent, { spaces: 2 });
}

async function hoist() {
    const operationGenerator = await getAllPackages();
    const worker = new PromisePool(operationGenerator, 8);
    worker.start()
        .then(editMainPackageFile)
        // eslint-disable-next-line no-console
        .then(() => console.log('done'));
}

hoist();
