import { getPossessivePronoun } from '../__helpers__/pronounHelper';

export const nameTitle = (isAnotherDriver) => `What's ${getPossessivePronoun(isAnotherDriver)} title and name?`;
export const genderTitle = (isAnotherDriver) => `What's ${getPossessivePronoun(isAnotherDriver)} gender?`;
export const firstNamePlaceholder = 'First name';
export const lastNamePlaceholder = 'Last name';
export const infoMessage = "You will be the policyholder, which means you're responsible for managing and paying for the policy.";
export const infoTitle = 'Important';
export const doctorFrefix = 'Dr';
export const requiredField = 'This filed is required';
export const requiredAnswer = 'Sorry, you need to answer this question';
export const specialCharacters = 'This field cannot contain special character';
export const infoCardParagraph = 'You\'ll be the account holder, so you\'re responsible '
    + 'for all payments and can manage the policies online.';
export const driversRelationship = 'What\'s their relationship to the policyholder?';
export const driversSelectPlaceholder = 'Please select';
export const generalErrorMessage = 'Sorry, we don\'t recognise that. Please try again.';
