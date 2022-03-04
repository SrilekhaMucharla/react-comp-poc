import { getPossessivePronoun } from '../__helpers__/pronounHelper';

export const header = 'Want to speed things up?';
// eslint-disable-next-line max-len
export const label = 'You\'ll get a faster quote if you scan your driving licence...';
export const disclaimer = '*Based on online quoted premiums from June to August 2021';
export const tooltipContentLine1 = (isAnotherDriver) => `We'll be able to access ${getPossessivePronoun(isAnotherDriver)} driving information from the DVLA, `
    + `so we can calculate any discounts you qualify for based on ${getPossessivePronoun(isAnotherDriver)} driving record.`;
// eslint-disable-next-line max-len
export const tooltipContentLine2 = (isAnotherDriver) => (isAnotherDriver ? 'Their licence must be from the UK as DVLA data isn\'t available for licences from Northern Ireland, the Isle of Man or the Channel Islands.'

    : 'Your licence must be from England, Wales or Scotland as DVLA data isn\'t available '
    + 'for licences from Northern Ireland, the Isle of Man or the Channel Islands.');

export const continueLabel = 'Continue (without scanning)';
export const scanLabel = 'Scan driving licence';
export const wizardTooltip = (isAnotherDriver) => `Saves you time! We can fill out ${getPossessivePronoun(isAnotherDriver)} driving information in the quote, `
    + 'so you\'ll have fewer questions to answer.';

export const scanOrContinueTitle = (isAnotherDriver) => (isAnotherDriver ? 'Please tell us about the driver you want to add...' : 'Want to speed things up?');
export const additionDriverInfo = 'This person will be an additional driver on the policy.';
// eslint-disable-next-line max-len
export const otherDriverLabel = (isAnotherDriver) => (isAnotherDriver ? 'You\'ll get a faster quote if you scan their driving licence...' : 'You\'ll get a faster quote if you scan your driving licence...');
export const optionalText = (isAnotherDriver) => (isAnotherDriver ? ' (optional)' : undefined);
