import {
    getPersonalPronoun, getPossessivePronoun, getPossessivePronounUppercase, getPersonalPronounThem
} from '../__helpers__/pronounHelper';

export const typeLabel = (isAnotherDriver) => `What type of driving licence do ${getPersonalPronoun(isAnotherDriver)} have?`;
export const typeOverlayMessage1 = (isAnotherDriver) => `${getPossessivePronounUppercase(isAnotherDriver)} driving licence photocard will tell ${getPersonalPronounThem(isAnotherDriver)} what type of licence ${getPersonalPronoun(isAnotherDriver)} have, such as full or provisional. `
+ `If ${getPossessivePronoun(isAnotherDriver)} licence type changes in the future, for example, ${getPersonalPronoun(isAnotherDriver)} pass ${getPossessivePronoun(isAnotherDriver)} driving test, you\'ll need to let us know.`;
export const typeOverlayMessage2 = (isAnotherDriver) => `Bear in mind ${getPersonalPronoun(isAnotherDriver)} also need to have made the DVLA/DVANI aware if ${getPersonalPronoun(isAnotherDriver)} have a notifiable medical condition. `
+ `If ${getPersonalPronoun(isAnotherDriver)}'ve not done so, your policy may not be valid.`;

export const typeValidationRequired = 'Sorry, you need to answer this question.';
export const typeValidationVM = 'Only predefine values are allowed.';

export const otherLabel = 'What type is it?';
export const drivingLicenceTypeInfo = 'Driving Licence Type Info';

export const P_PU = 'UK Provisional';
