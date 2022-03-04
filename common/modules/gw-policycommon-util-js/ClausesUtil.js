import _ from 'lodash';
import stereotype from 'stereotype';
import ViewModelUtil from 'gw-portals-viewmodel-js/ViewModelUtil';

let dependentClauses = [];
const TERM_VALUE_PROP_NAMES = [
    'directBooleanValue',
    'directDateValue',
    'directStringValue',
    'directValue',
    'chosenTerm'
];

function getTermValue(term) {
    const valueProp = TERM_VALUE_PROP_NAMES.find((propName) => _.get(term, propName));
    return _.get(term, valueProp);
}

/**
 * Retruns list of Dependent Clauses
 * @returns {array} array of dependent clauses
 */
function getDependentClauseList() {
    return dependentClauses;
}

/**
 * Returns the path to the clause given the path one of its schedules
 * @param {String|{model: string}} schedulePath the path to changed object
 * @returns {String} the path to the clause value
 */
function schedulePathToClausePath(schedulePath) {
    // onBlur event returns an object instead of path as a String
    const path = _.isString(schedulePath) ? schedulePath : schedulePath.model;
    const pathToClause = path.replace(/.schedule.*$/, '');
    return pathToClause;
}

function getPathToTerm(changedPath) {
    // onBlur event returns an object instead of path as a String
    const path = _.isString(changedPath) ? changedPath : changedPath.model;
    const matched = /(.*.terms(.children)?\[\d+\])(.*$)/.exec(path);
    if (!matched) {
        return changedPath;
    }
    const [, termPath] = matched;
    return termPath;
}

/**
 * Returns the path for the value (non VM) of the base clause
 * @param {String|{model: string}} objectPath the path to changed object
 * @returns {String} the path to the clause value
 */
function getObjectPathFromChangedPath(objectPath) {
    // onBlur event returns an object instead of path as a String
    const path = _.isString(objectPath) ? objectPath : objectPath.model;
    // get the path to the parent VM (strips out '.value' if present)
    const parentPath = path.replace(/\.[^.]+(\.value)?$/, '');
    return `${parentPath}.value`;
}

/**
 * Calls the server to retrieve the dependent clauses
 * @param {object} ClauseService clause service
 * @param {string} jobNumber - submission number
 * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
 * @returns {array} dependent clauses
 */
function getDependentClausesFromServer(ClauseService, jobNumber, additionalHeaders = {}) {
    return ClauseService.getDependentClausesForLob(jobNumber, additionalHeaders).then((depCovs) => {
        dependentClauses = depCovs;

        return depCovs;
    });
}

/**
 * Takes an object and returns if it is a term
 * @param {Object} baseObject - an object to decide if its a term.
 * @returns {Boolean} returns true if it is consistent with the shape of the term DTO
 */
function isTerm(baseObject) {
    const hasTermValue = !!getTermValue(baseObject);
    return hasTermValue && _.has(baseObject, 'coveragePublicID');
}

/**
 * Takes an object and returns if it is a clause
 * @param {Object} baseObject - an object to decide if its a clause.
 * @returns {Boolean} returns true if it is consistent with the shape of the clause DTO
 *                    e.g Coverage, Exclusion or Condition
 */
function isClause(baseObject) {
    return _.has(baseObject, 'coverageCategoryCode') && _.has(baseObject, 'terms');
}

/**
 * Returns if there is no dependent clauses
 * @returns {Boolean} returns true if dependent clauses is empty
 */
function isDependentClausesEmpty() {
    return _.isEmpty(dependentClauses);
}

/**
 * Takes a clause ID and returns true if it is a clause that has dependencies
 * @param {array} clausePublicID - clause ID
 * @returns {object} the dependent caluse if it is a clause that has dependencies or null if
 *                  no dependent calauses exist
 * @private
 */
function getDependentClause(clausePublicID) {
    if (isDependentClausesEmpty()) {
        return null;
    }
    return dependentClauses.find(({ name }) => name === clausePublicID);
}

/**
 * Retrieves the parent clause from object, eg. if term is passed in,
 * it will return the parent clause
 * @param {object} baseObject - object to return parent of
 * @returns {object} return parent clause
 *
 * @private
 */
function getDependentClauseFromObject(baseObject) {
    let dependentClause = null;

    if (isClause(baseObject)) {
        dependentClause = getDependentClause(baseObject.publicID);
    } else if (isTerm(baseObject)) {
        dependentClause = _.clone(getDependentClause(baseObject.coveragePublicID));

        if (_.isNil(dependentClause)) {
            dependentClause = _.clone(getDependentClause(baseObject.type));
        }

        if (dependentClause) {
            // Shallow clone the dependentCoverage term so we can change
            // the name property without updating original object reference
            dependentClause.name = baseObject.coveragePublicID;
        }
    }
    return dependentClause;
}

function isClauseValid(clause) {
    const isClauseSelected = clause.selected;
    const areTermsValid = clause.terms.every((term) => {
        return term.required ? getTermValue(term) : true;
    });

    return isClauseSelected ? areTermsValid : true;
}

function validateClauses(clauses) {
    return clauses.every(isClauseValid);
}

/**
 * Checks if the clause should call the backend
 * @param {object} baseObject clause or term to test if it should be updated
 * @param {array} clauses all clauses
 * @returns {boolean} if the backend should be called
 */
function shouldClauseUpdate(baseObject, clauses) {
    if (isClause(baseObject)) {
        const clause = baseObject;

        const isSelectedAndHasTerms = clause.hasTerms && clause.selected;
        const isSelectedAndHasSchedules = !_.isEmpty(clause.schedule) && clause.selected;
        const isDependentClause = !!getDependentClause(clause.publicID);

        return isSelectedAndHasTerms || isSelectedAndHasSchedules || isDependentClause;
    }
    if (isTerm(baseObject)) {
        const term = baseObject;

        const isDependentTerm = !!getDependentClauseFromObject(term);
        const clause = clauses.find(({ publicID }) => publicID === term.coveragePublicID);

        return isDependentTerm && isClauseValid(clause);
    }
    return false;
}

/**
 * Gets the path for the list of clauses eg. additionalCoverages, lobCoverages, baseCoverages
 * @param {string} path path of changed object
 * @returns {boolean} returns the path to the clause list
 */
function getClauseListPath(path) {
    const removeByIndex = (tempArray, index) => {
        return tempArray.filter((_el, i) => i < index);
    };

    const pathSections = path.split('.children');

    // if we find terms remove everything from terms on
    const index = pathSections.findIndex((section) => {
        return _.includes(section, '.terms');
    });

    let newArray;

    if (index === -1) { // it's a clause
        newArray = removeByIndex(pathSections, pathSections.length - 1);
    } else { // it's a term
        newArray = removeByIndex(pathSections, index);
    }

    return newArray.join('.children');
}

/**
 * Takes an object  and filters out any clauses that have not been updated
 * (or dont have updated terms)
 * @param {Object} clauses - an object consisting of LOBS with clause properties.
 * @returns {Object} the same structure as allCoverages, but with the coverages reduced.
 *                  Empty lists are marked as undefined
 */
function filterUnchangedClauses(clauses) {
    // remove any coverages from the array that have not been updated
    if (_.isArray(clauses)) {
        const updatedClauses = _.filter(clauses, (clause) => {
            // return updated Clauses or Clauses with updated terms.
            // Also return everything that isnt a coverage (i.e. doesnt have coverageCategoryCode)
            return clause.updated === true
                || _.filter(clause.terms, { updated: true }).length > 0
                || !clause.coverageCategoryCode;
        });
        return (updatedClauses.length > 0) ? updatedClauses : undefined;
    }
    return clauses;
}

/**
 * Puts the cluses in an object to send to the server containing all the changed clauses
 * @param {Object|Array} clauses - All the objects to send to the server
 * @param {string} lobName - Name of the Lob
 * @param {string} clauseType - type of clause, additionalCoverage, lobCoverage
 * @returns {Object} object to send to the server containing all the changed clauses
 */
function structureClausesForServer(clauses, lobName, clauseType) {
    // object containing multiple clause types:
    // eg. { lineCoverages: [ ...{clauses} ], vehicle: [ ...{clauses} ] }
    let clausesFromObject = [];
    // single clause type: [ ...{clauses} ]
    let clausesFromArray = {};

    if (_.isArray(clauses)) {
        clausesFromArray = {
            [clauseType]: filterUnchangedClauses(clauses)
        };
    } else {
        clausesFromObject = Object.entries(clauses).map(([clauseTypeKey, clause]) => ({
            [clauseTypeKey]: filterUnchangedClauses(clause)
        }));
    }
    return {
        [lobName]: Object.assign({}, clausesFromArray, ...clausesFromObject)
    };
}

function getLobNameFromPath(path) {
    const pathSections = path.split('.');

    const lobDataSectionIndex = pathSections.findIndex((section) => section === 'lobData');
    const lobNameIndex = lobDataSectionIndex + 1;

    return pathSections[lobNameIndex];
}

function getLastSectionOfPath(path) {
    const pathSections = path.split('.');
    const lastSectionIndex = pathSections.length - 1;

    return pathSections[lastSectionIndex];
}

function setClauseScheduleValue(vm, value, path) {
    const clonedData = _.cloneDeep(vm.value);
    const schedulePath = ViewModelUtil.getNonVMPath(path);
    const clausePath = schedulePathToClausePath(schedulePath);
    // set clause to updated
    _.set(clonedData, `${clausePath}.updated`, true);
    // update the data
    _.set(clonedData, schedulePath, value);

    // eslint-disable-next-line no-param-reassign
    vm.value = clonedData;
    return vm;
}

function setClauseTermUpdated(data, path) {
    const pathToTermVM = getPathToTerm(path);
    const pathToTerm = ViewModelUtil.getNonVMPath(pathToTermVM);
    _.set(data, `${pathToTerm}.updated`, true);
}

function setClauseValue(vm, value, path) {
    const clonedModel = _.cloneDeep(vm.value);
    if (path.includes('.terms')) {
        setClauseTermUpdated(clonedModel, path);
    }

    const basePath = getObjectPathFromChangedPath(path);
    const nonVMChangedPath = ViewModelUtil.getNonVMPath(path);
    const nonVMBasePath = ViewModelUtil.getNonVMPath(basePath);
    const realValue = stereotype(value);

    _.set(clonedModel, nonVMChangedPath, value);

    // set flag to changed
    _.set(clonedModel, `${nonVMBasePath}.updated`, true);

    // checks the type of the realValue and the value in the base object
    // incase the realValue is an empty string and the correct type can
    // be taken from the base object
    _.set(clonedModel, nonVMChangedPath, realValue);

    // eslint-disable-next-line no-param-reassign
    vm.value = clonedModel;

    return vm;
}

/**
 * Finds the all the clause ID's that have been removed in the new submission
 * @param {object} oldSubmissionVM - current submission
 * @param {object} newSubmissionVM - new submission
 * @param {string} clausesPath - path to clauses
 * @returns {Array} The new invalid array
 */
function getRemovedClausesID(oldSubmissionVM, newSubmissionVM, clausesPath) {
    const oldClauses = _.get(oldSubmissionVM, `${clausesPath}.value`);
    const newClauses = _.get(newSubmissionVM, `${clausesPath}.value`);

    const oldPublicIDs = oldClauses.map((clause) => clause.publicID);
    const newPublicIDs = newClauses.map((clause) => clause.publicID);

    return oldPublicIDs.filter((clauseID) => !_.includes(newPublicIDs, clauseID));
}

/**
 * Gets the parent path for the last coverages object
 * @param {string} path path of changed object
 * @returns {string} returns parent path for the last coverages object
 */
function getParentCoveragePath(path) {
    const pathSections = path.split('.');
    const coveragesIndex = pathSections.lastIndexOf('coverages');

    return coveragesIndex !== -1
        ? pathSections.slice(0, coveragesIndex).join('.')
        : undefined;
}

/**
 * Check if path contains subcoverages
 * @param {string} path path of changed object
 * @returns {boolean} returns if path contains subcoverages
 */
function hasSubCoverages(path) {
    const pathSections = path.split('.');
    return pathSections.filter((value) => value === 'coverages').length > 1;
}

export default {
    getDependentClauseList,
    getDependentClausesFromServer,
    setClauseScheduleValue,
    setClauseValue,
    isClause,
    isTerm,
    validateClauses,
    isDependentClausesEmpty,
    shouldClauseUpdate,
    filterUnchangedClauses,
    getClauseListPath,
    structureClausesForServer,
    getLobNameFromPath,
    getLastSectionOfPath,
    getObjectPathFromChangedPath,
    getRemovedClausesID,
    getParentCoveragePath,
    hasSubCoverages
};
