/* eslint-disable max-len */
import { getPossessivePronoun } from '../__helpers__/pronounHelper';

export const tooltipContentLine1 = (isAnotherDriver) => `We'll be able to access ${getPossessivePronoun(isAnotherDriver)} driving information from the DVLA, `
    + `so we can  calculate any discounts you qualify for, based on ${getPossessivePronoun(isAnotherDriver)} driving record.`;
export const tooltipContentLine2 = (isAnotherDriver) => `${isAnotherDriver ? 'Their' : 'Your'} licence must be from England, Wales or Scotland as DVLA data isn't available for licences from Northern Ireland, the Isle of Man or the Channel Islands.`;
export const basedOn = '*Based on online quoted premiums from June to August 2021';

export const wizardTooltip = (isAnotherDriver) => `Saves you time! We can fill out ${getPossessivePronoun(isAnotherDriver)} driving information in the quote, so you\'ll have fewer questions to answer.`;

export const dlnLabel = (isAnotherDriver) => `Tell us ${getPossessivePronoun(isAnotherDriver)} driving licence number and you could get a discount...`;
export const dlnOptionalLabel = ' (optional)';

export const error = 'Sorry, we can\'t find that licence number. Please try again or leave it blank to continue';
export const errorDefault = 'There were errors while retrieving driver information for licence!';

export const enter5chars = 'Please enter the next five\n'
    + 'characters:';
export const validateLicence = 'Validate Licence';
export const licenceNumberNotFound = 'Licence number not found';

export const dlnContinueAction = 'Continue - Redirecting from: HastingsPersonalDetails_DrivingLicence_Number';
export const continueBtn = 'Continue';
