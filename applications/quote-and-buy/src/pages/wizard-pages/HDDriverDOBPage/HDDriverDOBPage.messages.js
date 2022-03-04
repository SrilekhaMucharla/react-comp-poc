import { getPersonalPronoun, getPossessivePronoun } from '../__helpers__/pronounHelper';

export const dateOfBirthTitle = (isAnotherDriver) => `What's ${getPossessivePronoun(isAnotherDriver)} date of birth?`;
export const dateOfBirthOverlayText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna'
    + ' aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in'
    + ' reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui'
    + ' officia deserunt mollit anim id est laborum.';
export const dateOfUKResidence = (isAnotherDriver) => `When did ${getPersonalPronoun(isAnotherDriver)} become a UK resident?`;
export const dateOfUKResidenceOverlayText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore'
    + ' magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in'
    + ' reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia'
    + ' deserunt mollit anim id est laborum.';
export const dateGreaterThanToday = 'date is greater than todays date';
export const residentDayMin = 'day must be greater than 1';
export const residentDayMax = 'day must be less than or equal to 31';
export const residentMonthMin = 'month must be greater than or equal to 1';
export const residentMonthMax = 'month must be less than or equal to 12';
export const monthPlaceholder = 'MM';
export const dayPlaceholder = 'DD';
export const yearPlaceholder = 'YYYY';
export const GENERAL_ERROR_MESSAGE = 'Sorry, we don\'t recognise that date. Please try again.';
export const REQUIRED_ERROR_MESSAGE = 'Sorry, you need to answer this question.';
export const PAST_ERROR_MESSAGE = 'Sorry, you can\'t use a date in the past. Please try again.';
export const FUTURE_ERROR_MESSAGE = 'Sorry, you can\'t use a date in the future';
export const BEFORE_DATE_OF_BIRTH_ERROR_MESSAGE = 'Sorry, you can\'t use a date that\'s before your date of birth.';
export const OLDER_THAN_99_ERROR_MESSAGE = 'Sorry, that doesn\'t seem quite right. Please try again.';
export const YOUNGER_THAN_17_ERROR_MESSAGE = 'Please enter a date that\'s less than 30 days before your 17th birthday';
