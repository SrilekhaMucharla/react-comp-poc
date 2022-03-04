import _ from 'lodash';
import { ErrorType, ErrorLevel, UWBlockingPoint } from './errors';


/** @typedef {import('./errors').EdgeErrorsAndWarnings} EdgeErrorsAndWarnings */
/** @typedef {import('./errors').EdgeGenericIssue} EdgeGenericIssue */
/** @typedef {import('./errors').EdgeFieldIssue} EdgeFieldIssue */
/** @typedef {import('./errors').EdgeUnderwritingIssue} EdgeUnderwritingIssue */
/** @typedef {import('./errors').EdgeOfferingIssue} EdgeOfferingIssue */
/** @typedef {import('./errors').GenericUIIssue} GenericUIIssue */
/** @typedef {import('./errors').ValidationIssueUI} ValidationIssueUI */
/** @typedef {import('./errors').FieldValidationIssueUI} FieldValidationIssueUI */
/** @typedef {import('./errors').UnderwritingIssueUI} UnderwritingIssueUI */

/**
 * Converts an offering Issue coming from the edge to a Underwriting Issue that can be displayed
 * in the UI
 * @param {EdgeOfferingIssue} offeringIssue the offering issue coming from the Edge
 * @param {EdgeUnderwritingIssue} parentUWIssue the parent UW issue of the given offeringIssue
 * @returns {UnderwritingIssueUI}
 */
function edgeOfferingIssueToUndewritingIssueUI(offeringIssue, parentUWIssue) {
    const { longDescription, shortDescription } = parentUWIssue;
    const {
        currentBlockingPoint,
        publicID,
        offering,
        canUserApprove,
        hasApprovalOrRejection
    } = offeringIssue;
    const isNonBlocking = currentBlockingPoint === UWBlockingPoint.NON_BLOCKING;
    return {
        id: `${publicID} - ${offering} - ${longDescription}`,
        title: shortDescription,
        description: longDescription,
        type: ErrorType.UNDERWRITING_ISSUE,
        level: ErrorLevel.LEVEL_ERROR,
        isHidden: isNonBlocking || hasApprovalOrRejection,
        canUserApprove,
        hasApprovalOrRejection,
        offering,
        currentBlockingPoint,
        originalDTO: parentUWIssue // retain the original UW issue
    };
}

/**
 * Converts an Edge underwriting issue into separate
 * issues for each of the affected offerings
 * @param {EdgeUnderwritingIssue} uwIssue the underwriting issue
 * @returns {Array<UnderwritingIssueUI>}
 */
function edgeUWIssueToOfferingIssues(uwIssue) {
    const { onOfferings: offeringIssues } = uwIssue;
    return offeringIssues
        .map((offeringIssue) => edgeOfferingIssueToUndewritingIssueUI(offeringIssue, uwIssue));
}

/**
 * Converts a validation issue coming from the Edge into one that can
 * be displayed in the UI
 * @param {EdgeGenericIssue} validationIssue the validation issue coming from the Edge
 * @returns {ValidationIssueUI} a validation issue ready to be displayed in the UI
 */
function edgeValidationIssueToValidationIssueUI(validationIssue) {
    const {
        reason,
        type,
        flowStepId,
        relatedEntity
    } = validationIssue;
    return {
        id: reason,
        title: reason,
        description: reason,
        type: ErrorType.GENERIC_VALIDATION,
        level: type === 'error' ? ErrorLevel.LEVEL_ERROR : ErrorLevel.LEVEL_WARN,
        validationStep: flowStepId,
        isHidden: false,
        relatedEntity
    };
}

/**
 * Converts a field validation issue coming from the Edge into one that can
 * be displayed in the UI
 * @param {EdgeFieldIssue} fieldValidationIssue the field validation issue coming from the Edge
 * @returns {FieldValidationIssueUI} a validation issue ready to be displayed
 */
function edgeFieldValidationIssueToFieldValidationIssueUI(fieldValidationIssue) {
    const {
        relatedEntity,
        reason,
        flowStepId,
        type
    } = fieldValidationIssue;
    const {
        publicID,
        displayName,
        dtoFieldName,
        dtoName
    } = relatedEntity;
    return {
        id: `${publicID} - ${reason}`,
        title: displayName,
        type: ErrorType.FIELD_VALIDATION,
        level: type === 'error' ? ErrorLevel.LEVEL_ERROR : ErrorLevel.LEVEL_WARN,
        description: reason,
        validationStep: flowStepId,
        isHidden: false,
        dtoFieldName,
        dtoName,
        relatedEntity
    };
}

/**
 * Parses the errors coming from the Edge and converts them for being
 * displayed in the UI
 * @param {EdgeErrorsAndWarnings} edgeErrors errors and warnings coming from the Edge apy
 * @returns {Array<GenericUIIssue>}
 */
export function parseErrors(edgeErrors) {
    const uwIssues = _(_.get(edgeErrors, 'underwritingIssues', []))
        .flatMap(edgeUWIssueToOfferingIssues).value();

    const genericValidationIssues = _.get(edgeErrors, 'validationIssues.issues', [])
        .map(edgeValidationIssueToValidationIssueUI);

    const fieldValidationIssues = _.get(edgeErrors, 'validationIssues.fieldIssues', [])
        .map(edgeFieldValidationIssueToFieldValidationIssueUI);

    return uwIssues
        .concat(genericValidationIssues)
        .concat(fieldValidationIssues);
}

const getErrorId = (err) => err.id;
const isUnderwritingIssue = (err) => err.type === ErrorType.UNDERWRITING_ISSUE;

/**
 * Merge the existing errors with the new UI errors, retaining the old when if they already existed
 *
 * E.g.
 * If an error was previously notified and it is still in the new list,
 *     that is retained (the old one is preferred).
 * If an error is new, but it was not in the previous list, it will be added to the returned list
 * If an error was in the old list but it is not in the new list, it will not be returned
 *
 * @param {Array<GenericUIIssue>} newUIErrors the UI errors that are being reported
 * @param {Array<GenericUIIssue>} oldUIErrors the UI errors that were previously reported
 * @returns {Array<GenericUIIssue>}
 */
export function mergeErrors(newUIErrors = [], oldUIErrors) {
    const indexOfOldErrors = _.keyBy(oldUIErrors, getErrorId);
    const mergedErrors = newUIErrors
        .map((newErr) => {
            if (isUnderwritingIssue(newErr)) {
                return newErr;
            }
            // the error has never been seen before
            if (_.isNil(indexOfOldErrors[newErr.id])) {
                return newErr;
            }

            // prefer the old the old error if a matching one existed
            return indexOfOldErrors[newErr.id];
        });

    return mergedErrors;
}
