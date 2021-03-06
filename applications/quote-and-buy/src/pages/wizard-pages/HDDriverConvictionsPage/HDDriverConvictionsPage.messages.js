import { getPersonalPronoun } from '../__helpers__/pronounHelper';

export const requiredField = 'Sorry, you must answer all questions to be able to continue';
export const convictionMsg = (isAnotherDriver) => `What were ${getPersonalPronoun(isAnotherDriver)} convicted for?`;
export const convictionKindMsg = 'What type of conviction was it?';
export const convictionDateMsg = (isAnotherDriver) => `When were ${getPersonalPronoun(isAnotherDriver)} convicted?`;
export const convictionFiveYearsMsg = 'Remember, we only need to know if it happened in the past five years.';
export const convictionPenaltyPointsMsg = (isAnotherDriver) => `How many penalty points did ${getPersonalPronoun(isAnotherDriver)} get?`;
export const convictionDrivingBannedMsg = (isAnotherDriver) => `Were ${getPersonalPronoun(isAnotherDriver)} banned from driving?`;
export const convictionFormMsg = (isAnotherDriver) => `In the last five years, have ${getPersonalPronoun(isAnotherDriver)} had any driving-related:`;
export const convictionFormCriminalMsg = (isAnotherDriver) => `Do ${getPersonalPronoun(isAnotherDriver)} have any unspent \nnon-motoring convictions?`;
export const dateLessThanFiveYearsMessage = 'You can\'t enter a date that\'s not within the last five years';
export const dateRequiredMessage = 'Sorry, we don\'t recognise that date. Please try again';
export const requiredFieldMessage = 'Sorry, you must answer all questions to be able to continue';
export const invalidValueMessage = 'Field value is invalid';
export const deleteHeader = 'Are you sure?';
export const deleteConfirmMessage = 'Yes';
export const deleteCancelMessage = 'Go back';
export const deleteInfoMessage = 'This will remove the conviction.';
export const convictionsLabel = 'Convictions';
export const endorsementsLabel = 'Endorsements';
export const fixedPenaltiesLabel = 'Fixed penalties';
export const disqualificationsOrBansLabel = 'Disqualifications or bans';
export const bannedMonthsLabel = (isAnotherDriver) => `How long were ${getPersonalPronoun(isAnotherDriver)} banned for?`;
export const addConvictionButtonLabel = 'Add';
export const updateConvictionButtonLabel = 'Update';
export const addAnotherConviction = 'Add another conviction';
export const removeLabel = 'Remove';
export const convictionsInfo = 'Convictions Info';
export const criminalConvInfo = 'Criminal Convictions Info';
export const banDrivingInfo = 'Ban Driving Info';
export const convictionCauseInfo = 'Conviction Cause Info';
export const conviction = 'Conviction';
export const edit = 'Edit';
