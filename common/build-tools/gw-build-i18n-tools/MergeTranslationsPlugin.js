const {
    readJson,
    writeJson,
    stat,
    mkdirp,
} = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const glob = require('fast-glob');
const normalizePath = require('normalize-path');


const LANG_DIR = './src/generated/translation';

/**
 * Adds the given message with the given id (display key) to the given collection
 *
 * **This alters the given collection**
 * @param {string} message the message to assign to the collection
 * @param {string} id the id of the message being assigned
 * @param {Object} collection an object possibly containing other displayKeys and messages
 * @throws if the id already exists in the collection
 */
function assignMessageToCollection(message, id, collection) {
    // eslint-disable-next-line no-prototype-builtins
    if (collection.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`);
    }
    // eslint-disable-next-line no-param-reassign
    collection[id] = message;
}

/**
 * Merges partial *.messages.json files into one json
 *
 * Partial files are expexted to have the following structure:
 * Array of objects containing id and defaultMessage
 *
 * Resulting object will have displayKeys as keys and the corresponding defaultMessage
 * as value
 *
 * @example
 * //*** file 1 ***
 * [
 *  "id": "display.key.for.A message",
 *  "defaultMessage": "A message"
 * ]
 * //*** file 2 ***
 * [
 *  "id": "display.key.for.Another message",
 *  "defaultMessage": "Another message"
 * ]
 * //*** result ***
 * {
 *   "display.key.for.A message": "A message",
 *   "display.key.for.Another message": "Another message"
 * }
 *
 * @param {string[]} files paths to the files that should be merged
 * @returns {Promise<Object>} a Promise for an object with displayKeys
 *                              as keys and defaultMessages as values
 */
async function mergePartialJsonFiles(files) {
    const fileContents = await Promise.all(files.map((file) => readJson(file)));

    return [].concat(...fileContents) // aggregate the arrays in fileContents
        .sort(({ id: keyId1 }, { id: keyId2 }) => keyId1.localeCompare(keyId2))
        .reduce((collection, displayKey) => {
            const { defaultMessage, id } = displayKey;
            assignMessageToCollection(defaultMessage, id, collection);
            return collection;
        }, {});
}

/**
 * Merges the JSON files paths specified as input
 * @param {string[]} files paths to json files that should be merged
 * @returns {Promise<Object>} a promise for an object with keys and corresponding values merged
 */
async function mergeJsonFiles(files) {
    const fileContents = await Promise.all(files.map((file) => readJson(file)));
    const mergedContent = Object.assign({}, ...fileContents);
    return mergedContent;
}

/**
 * Returns an object with the given paths as keys and the corresponding mtime as value
 * @param {string[]} files paths of files for which the mtime should be collected
 * @returns {Promise<Object>} a promise for an object with paths as keys and
 *                          the corresponding mtime as values
 */
async function getFilesInfo(files) {
    const filesStats = await Promise.all(files
        .map(async (file) => {
            const fileStat = await stat(file);
            return [file, fileStat.mtime.getTime()];
        }));
    return _.fromPairs(filesStats);
}

/**
 * Writes a file to disk but makes sure the directory tree exists before doing so.
 * @param {string} filePath the path to the file that should be written
 * @param {Object} content the object that should be written in the file
 * @returns {Promise}
 */
async function safeWriteJson(filePath, content) {
    const parentDir = path.dirname(filePath);
    await mkdirp(parentDir);
    await writeJson(filePath, content, {
        spaces: 2
    });
}

/**
 * Merges default messages for each component into one file and
 * translations for other languages into one file.
 */
class MergeTranslationsPlugin {
    constructor(options) {
        const defaultOptions = {
            frontendPartialsPattern: `${LANG_DIR}/partials/**/*.json`,
            frontendTranslationsMainFileName: 'en_US.json',
            frontendTranslationsDir: `${LANG_DIR}/frontend-translations`,
            backendTranslationsDir: `${LANG_DIR}/frontend-translations`,
            translationsDestinationDir: './src/i18n',
            localeFileName: `${LANG_DIR}/locale.json`,
            assetTranslationsDir: './assets/translations'
        };
        const opts = Object.assign({}, defaultOptions, options);

        this.frontendPartialsPattern = opts.frontendPartialsPattern;
        this.frontendTranslationsMainFileName = opts.frontendTranslationsMainFileName;
        this.frontendTranslationsDir = opts.frontendTranslationsDir;
        this.backendTranslationsDir = opts.backendTranslationsDir;
        this.translationsDestinationDir = opts.translationsDestinationDir;
        this.localeFileName = opts.localeFileName;
        this.assetTranslationsDir = opts.assetTranslationsDir;

        this.frontendTranslationsMainFile = path.join(
            this.frontendTranslationsDir,
            this.frontendTranslationsMainFileName
        );

        this.timestamps = {};

        this.isFileChanged = this.isFileChanged.bind(this);
        this.updateTimestamps = this.updateTimestamps.bind(this);
        this.mergeFrontendTranslations = this.mergeFrontendTranslations.bind(this);
        this.mergeWithBackendTranslations = this.mergeWithBackendTranslations.bind(this);

        mkdirp(this.translationsDestinationDir);
    }

    getBackendFileForLocale(localeName) {
        return path.join(this.backendTranslationsDir, `${localeName}.json`);
    }

    getFrontendFileForLocale(localeName) {
        return path.join(this.frontendTranslationsDir, `${localeName}.json`);
    }

    getAssetFileForLocale(localeName) {
        return path.join(this.assetTranslationsDir, `${localeName}.json`);
    }

    getTranslationDestinationFileForLocale(localeName) {
        return path.join(this.translationsDestinationDir, `${localeName}.json`);
    }

    areFilesUpdated(filesInfo) {
        return Object.entries(filesInfo).some(this.isFileChanged);
    }

    /**
     * Merges partial frontend translations into the main frontend translation file
     * A check is performed to see if any of the partials has changed since the last execution
     * to avoid unnecessary merges
     */
    async mergeFrontendTranslations() {
        const frontendPartials = await glob(normalizePath(this.frontendPartialsPattern));
        const filesInfo = await getFilesInfo(frontendPartials);
        if (this.areFilesUpdated(filesInfo)) {
            this.updateTimestamps(filesInfo);
            const mergedFrontendMessages = await mergePartialJsonFiles(frontendPartials);
            await safeWriteJson(this.frontendTranslationsMainFile, mergedFrontendMessages);
        }
    }


    /**
     * Merges frontend and backend translations into the corresponding final translation file
     * for all the locales.
     * A check is performed to see if any of the source translation files have changed
     * since the last execution to avoid unnecessary merges
     */
    async mergeWithBackendTranslations() {
        const { locales: localeConfig } = await readJson(this.localeFileName);
        const locales = Object.keys(localeConfig);
        const existingLocalizationFilesPattern = [
            `${this.backendTranslationsDir}/**/*.json`,
            `${this.frontendTranslationsDir}/**/*.json`,
            `${this.assetTranslationsDir}/**/*.json`,
        ].map((pattern) => normalizePath(pattern));
        const existingLocalizationFiles = await glob(existingLocalizationFilesPattern);
        const localeGroups = await Promise.all(locales
            .map(async (localeName) => {
                const fileNames = [
                    this.getBackendFileForLocale(localeName),
                    this.getFrontendFileForLocale(localeName),
                    this.getAssetFileForLocale(localeName)
                ].map((fileName) => normalizePath(fileName));
                // not all the files could be available (e.g. backend exists, but frontend doesn't)
                const files = _.intersection(fileNames, existingLocalizationFiles);
                const filesInfo = await getFilesInfo(files);
                return {
                    locale: localeName,
                    files,
                    filesInfo
                };
            }));

        const changedGroups = localeGroups
            .filter(({ filesInfo }) => this.areFilesUpdated(filesInfo));

        changedGroups.forEach(({ filesInfo }) => this.updateTimestamps(filesInfo));

        await Promise.all(
            changedGroups.map(async ({ locale, files }) => {
                const destinationFile = this.getTranslationDestinationFileForLocale(locale);
                const mergedContent = await mergeJsonFiles(files);
                await safeWriteJson(destinationFile, mergedContent);
            })
        );
    }

    /**
     * Merges all of the existing translations to create the application translation files
     * partials -> main frontend translation file
     *
     * and for each of the locales supported
     * frontend translation files + backend translation file ->  final translation file
     */
    async mergeTranslations() {
        await this.mergeFrontendTranslations();
        await this.mergeWithBackendTranslations();
    }

    /**
     * Checks if the given file has been updated comparing the internal plugin state with the given
     * file modified time
     * @param {[string, number]} arg takes an array for which the first item is the path to the file
     *                          and the second is the modified time on disk
     * @returns {boolean}
     */
    isFileChanged([filePath, fileModifiedTime]) {
        const lastKnownChange = this.timestamps[filePath] || 0;

        return fileModifiedTime > lastKnownChange;
    }

    /**
     * Updates the internal state of the plugin with the given filesInfo
     * @param {Object} filesInfo an object which keys are fileNames and
     *                          values are the corresponding mtime
     */
    updateTimestamps(filesInfo) {
        _.merge(this.timestamps, filesInfo);
    }

    apply(compiler) {
        compiler.hooks.beforeRun.tapPromise('MergeTranslations', async () => {
            // this ensures the final translations files exists before webpack tries to resolve
            // the dynamic imports
            await this.mergeTranslations();
        });

        compiler.hooks.emit.tapPromise('MergeTranslations', async () => {
            await this.mergeTranslations();
        });
    }
}

module.exports = MergeTranslationsPlugin;
