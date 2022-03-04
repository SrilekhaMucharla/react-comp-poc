import { getPersonalPronoun, getPossessivePronoun } from '../__helpers__/pronounHelper';

export const howLongLabel = (isAnotherDriver) => `How long have ${getPersonalPronoun(isAnotherDriver)} had ${getPossessivePronoun(isAnotherDriver)} licence?`;

export const howLongOverlayMessage = (isAnotherDriver) => `If ${getPersonalPronoun(isAnotherDriver)}\'re not sure, the date ${getPersonalPronoun(isAnotherDriver)} passed ${getPossessivePronoun(isAnotherDriver)} test will be on the back of ${getPossessivePronoun(isAnotherDriver)} licence photocard. `
+ `If ${getPersonalPronoun(isAnotherDriver)}\'ve not passed ${getPossessivePronoun(isAnotherDriver)} test yet, let us know how long ${getPersonalPronoun(isAnotherDriver)}\'ve had a provisional licence for.`;

export const validationRequired = 'Sorry, you need to answer this question.';
export const validationWrongDate = 'Sorry, we don\'t recognise that date. Please try again.';
export const validationMinDate = 'Sorry, this date needs to match your answer to the previous question.';
export const validationMaxDate = 'Sorry, this date needs to match your answer to the previous question.';
export const validationFutureDate = 'Sorry, you can\'t use a date in the future. Please try again';

export const whenLabel = (isAnotherDriver) => `When did ${getPersonalPronoun(isAnotherDriver)} get it?`;
export const drivingLicenceLengthInfo = 'Driving Licence Length Info';
