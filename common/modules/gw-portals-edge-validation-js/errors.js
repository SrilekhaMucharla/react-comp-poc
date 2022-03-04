/*
======================
    Edge Errors
======================
*/


/**
 * @typedef {Object} RelatedEntityField
 * @mixes RelatedEntity
 * @property {String} dtoName
 * @property {String} dtoFieldName
 * @property {String} fieldName
 */

/**
 * @typedef {Object} EdgeFieldIssue
 * @mixes EdgeGenericIssue
 * @property {RelatedEntityField} relatedEntity the related entity field
 */

/**
 * @typedef {Object} RelatedEntity
 * @property {number} fixedId the fixed ID of the entity
 * @property {String} type the entity type
 * @property {String} displayName the display name of the entity
 * @property {String} publicID the public ID of the entity
 */

/**
 * @typedef {Object} EdgeGenericIssue
 * @property {RelatedEntity} relatedEntity the related entity that triggered this error
 * @property {String} type the type of the error (error/warning)
 * @property {String} reason the reason for which the error has been raised
 * @property {String} level the validation level
 * @property {String} flowStepId the step id in the PAS that triggereth this error
 */

/**
 * @typedef {Object} EdgeOfferingIssue
 * @property {String} offering the name of the offering
 * @property {boolean} canUserApprove whether the current user can approve the underwriting issue
 * @property {UWBlockingPoint} currentBlockingPoint the blocking point
 * @property {String} publicID public ID of the offering UW issue
 * @property {boolean} hasApprovalOrRejection whether the issue has any approval or rejection
 */

/**
 * @typedef {Object} EdgeUnderwritingIssue
 * @property {boolean} canUserApprove Whether the user can approve the UWIssue
 * @property {Array<String>} offerings Offerings on which the issue happened
 * @property {boolean} hasApprovalOrRejection whether the issues has any approval or rejection
 * @property {UWBlockingPoint} currentBlockingPoint the blocking point
 * @property {String} shortDescription the short description
 * @property {String} longDescription the long description
 * @property {String} publicID public ID of the CUSTOM quote issue
 * @property {Array<EdgeOfferingIssue>} onOfferings Detail of the UW issue on the offerings
 */

/**
 * @typedef {Object} EdgeValidationIssues
 * @property {Array<EdgeFieldIssue>} [fieldIssues]
 * @property {Array<EdgeGenericIssue>} [issues]
 * @property {String} level
 */

/**
 * @typedef {Object} EdgeErrorsAndWarnings
 * @property {EdgeValidationIssues} validationIssues
 * @property {Array<EdgeUnderwritingIssue>} [underwritingIssues]
 */

/*
======================
    UI Errors
======================
*/

/**
 * @typedef {Object} GenericUIIssue
 * @property {String} id the id of the issue
 * @property {String} title the tile for the issue
 * @property {String} description the description of the issue
 * @property {ErrorType} type the type of the error (UW issue, Validation, Field Validation)
 * @property {ErrorLevel} level the level of the validation issue (error/warning)
 * @property {boolean} isHidden whether the issue should be hidden in the UI
 */

/**
 * @typedef {Object} ValidationIssueUI
 * @mixes GenericUIIssue
 * @property {String} validationStep where in the validation process the issue occurred
 * @property {RelatedEntity} relatedEntity the related entity
 */

/**
 * @typedef {Object} UnderwritingIssueUI
 * @mixes GenericUIIssue
 * @property {boolean} hasApprovalOrRejection
 * @property {boolean} canUserApprove
 * @property {String} offering
 * @property {EdgeUnderwritingIssue} originalDTO
 * @property {UWBlockingPoint} currentBlockingPoint
 */

/**
 * @typedef {Object} FieldValidationIssueUI
 * @mixes GenericUIIssue
 * @property {String} dtoFieldName the name of the DTO field
 * @property {String} dtoName the name of the DTO
 * @property {RelatedEntityField} relatedEntity the related entity
 */

/**
 * Types of errors
 * @readonly
 * @enum {String}
 */
export const ErrorType = {
    UNDERWRITING_ISSUE: 'UNDERWRITING_ISSUE',
    FIELD_VALIDATION: 'FIELD_VALIDATION',
    GENERIC_VALIDATION: 'GENERIC_VALIDATION'
};

/**
 * Levels of validation errors
 * @readonly
 * @enum {String}
 */
export const ErrorLevel = {
    LEVEL_ERROR: 'LEVEL_ERROR',
    LEVEL_WARN: 'LEVEL_WARN'
};

/**
 * Blocking point for Underwriting Issues
 * @readonly
 * @enum {String}
 */
export const UWBlockingPoint = {
    BLOCKS_QUOTE: 'BlocksQuote',
    BLOCKS_QUOTE_RELEASE: 'BlocksQuoteRelease',
    BLOCKS_ISSUANCE: 'BlocksIssuance',
    BLOCKS_BIND: 'BlocksBind',
    REJECTED: 'Rejected',
    NON_BLOCKING: 'NonBlocking'
};
