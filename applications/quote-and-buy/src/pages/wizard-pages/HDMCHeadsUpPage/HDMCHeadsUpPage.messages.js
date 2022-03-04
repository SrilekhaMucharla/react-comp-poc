import { getPossessivePronoun } from '../__helpers__/pronounHelper';

export const dlnOptionalLabel = ' (optional)';
export const headstitle = 'Just a heads up...';
export const scantitle = 'Get a faster quote by scanning your driving licence...';
export const headsupText = 'You need to be the first driver added, so you’ll be the policyholder for this car.'
 + ' You’ll also be the main account holder (which means you’re responsible for all payments and managing the policies online).';
export const understandText = 'I understand';
export const scanbtnText = 'Scan driving licence';
export const continuebtnText = 'Continue (without scanning)';
export const tipBody = 'Saves you time! We can fill out your driving information in the quote, so you\'ll have fewer questions to answer.';

export const header = 'Want to speed things up?';
export const label = 'Get a faster quote by scanning your driving licence... (optional)';
export const disclaimer = '*Based on online quoted premiums from June to August 2021';

export const tooltipContentLine1 = (isAnotherDriver) => `We'll be able to access ${getPossessivePronoun(isAnotherDriver)} driving information from the DVLA, `
    + `so we can  calculate any discounts you qualify for, based on ${getPossessivePronoun(isAnotherDriver)} driving record.`;
export const tooltipContentLine2 = (isAnotherDriver) => (isAnotherDriver ? 'We\'ll be able to access their driving information from the DVLA, so we can'
    + ` calculate any discounts you qualify for based on their driving record.
    Their licence must be from England, Wales or Scotland as DVLA data isn't available for licences from Northern Ireland, the Isle of Man or the Channel Islands.`
    : 'Your licence must be from England, Wales or Scotland as DVLA data isn\'t available '
    + 'for licences from Northern Ireland, the Isle of Man or the Channel Islands.');

export const continueLabel = 'Continue (without scanning)';
export const scanLabel = 'Scan my licence';
export const wizardTooltip = 'Saves you time! We can fill out your driving information in the quote, so you\'ll have fewer questions to answer.';

export const otherDriverHeader = 'Please tell us about the driver you want to add...';
export const additionDriverInfo = 'This person will be an additional driver on the policy.';
export const otherDriverLabel = 'Tell us their driving licence number and you could get a discount...';
export const optionalText = ' (optional)';
