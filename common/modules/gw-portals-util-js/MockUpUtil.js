import _ from 'lodash';
// eslint-disable-next-line import/no-unresolved
import config from 'app-config';

const { mockData: mockUpDefaultData } = config;

/**
 * Returns the mocked data existing on mockup data
 * @param {string} mockDataKey
 * @returns {string}
 */
const getMockData = (mockDataKey) => {
    const mockData = _.get(mockUpDefaultData, mockDataKey);
    return mockData || '';
};

/**
 * Checks if a displayName is mocked
 * @param {object} baseObject - root object e.g submissionVM
 * @param {string} pathToMocks - path to mocks containing transaction and lob e.g quote.ho
 * @param {string} pathToValue - path to displayName
 * @param {string} pathToCheck - path to values to compare
 * @returns {boolean}
 */
const isDisplayNameMocked = (baseObject, pathToMocks, pathToValue, ...pathToCheck) => {
    const mockDataItems = getMockData(pathToMocks);
    const displayValue = _.get(baseObject, pathToValue);

    return pathToCheck.every((path) => {
        const mockValue = _.get(mockDataItems, path);
        return displayValue.includes(mockValue);
    });
};


/**
 * Checks if a value has been mocked
 * @param {object} baseObject - root object e.g submissionVM
 * @param {string} pathToMocks - path to mocks containing transaction and lob e.g quote.ho
 * @param {string} pathToValue - path to values to compare
 * @returns {boolean}
 */
const isValueMocked = (baseObject, pathToMocks, ...pathToValue) => {
    const mockDataItems = getMockData(pathToMocks);

    return pathToValue.every((path) => {
        const realValue = _.get(baseObject, path);
        const mockValue = _.get(mockDataItems, path);

        // if realValue resolves to an object it won't match the mockData so we reformat it
        // e.g dateOfBirth will resolve to { date: 1, month: 1, year: 1988 }
        if (_.isObject(realValue)) {
            const deconstuctObjectPaths = Object.keys(realValue).map((valuePath) => `${path}.${valuePath}`);
            return isValueMocked(baseObject, pathToMocks, ...deconstuctObjectPaths);
        }

        return mockValue && _.isEqual(realValue, mockValue);
    });
};

/**
 * Check if baseObject properties have mocked values assigned and clean up
 * @param {object} baseObject - root object e.g submissionVM
 * @param {string} pathToMocks - path to mocks containing transaction and lob e.g quote.ho
 * @param {string[]} pathsToClean - path to values to clean
 * @returns {object}
 */
const cleanUpMockedProperties = (baseObject, pathToMocks, ...pathsToClean) => {
    const mockDataItems = getMockData(pathToMocks);

    if (!_.isEmpty(pathsToClean)) {
        pathsToClean.forEach((path) => {
            if (isValueMocked(baseObject, pathToMocks, path)) {
                _.set(baseObject, path, undefined);
            }
        });
    } else {
        Object.keys(mockDataItems).forEach((path) => {
            if (isValueMocked(baseObject, pathToMocks, path)) {
                _.set(baseObject, path, undefined);
            }
        });
    }

    return baseObject;
};

/**
 * Sets values to mock data if it doesn't already have a value.
 * If pathsToSet is not provided all values in the mock data will be set
 * @param {object} baseObject - root object e.g submissionVM
 * @param {string} pathToMocks - path to mocks containing transaction and lob e.g quote.ho
 * @param {string[]} pathsToSet - path to values to set
 * @returns {object}
 */
const setMockData = (baseObject, pathToMocks, ...pathsToSet) => {
    const mockData = getMockData(pathToMocks);

    if (!_.isEmpty(pathsToSet)) {
        pathsToSet.forEach((path) => {
            const actualValue = _.get(baseObject, path);
            const mockValue = _.get(mockData, path);

            if (!actualValue) {
                _.set(baseObject, path, mockValue);
            }
        });
    } else {
        Object.entries(mockData).forEach(([path, mockValue]) => {
            const actualValue = _.get(baseObject, path);

            if (!actualValue) {
                _.set(baseObject, path, mockValue);
            }
        });
    }

    return baseObject;
};

/**
 * MockupUtil was designed to control all mock-up information used through Digital applications
 */
export default {
    getMockData,
    isDisplayNameMocked,
    isValueMocked,
    cleanUpMockedProperties,
    setMockData
};
