/* eslint-disable max-len */
import { getPersonalPronoun, getPossessivePronoun } from '../__helpers__/pronounHelper';

export const requiredFieldMessage = 'Sorry, you must answer all questions to be able to continue';
export const invalidValueMessage = 'Field value is invalid';
export const dateLessThanFiveYearsMessage = "You can't enter a date that's not within the last five years";
export const invalidDateMessage = "Sorry, we don't recognise that date. Please try again";

export const yes = 'Yes';
export const no = 'No';
export const trueValue = 'true';
export const falseValue = 'false';

export const typeValidationRequired = 'Sorry, you need to answer this question.';
export const typeValidationVM = 'Only predefine values are allowed.';

export const declinedOrCancelledMessage = (isAnotherDriver) => `Have ${getPersonalPronoun(isAnotherDriver)} or any driver had insurance declined, cancelled, voided or any special terms imposed?`;
export const anyClaimsMessage = (isAnotherDriver) => `In the last five years, have ${getPersonalPronoun(isAnotherDriver)} had any:`;
export const anyClaimsFullQuestion = (isAnotherDriver) => `In the last five years, have ${getPersonalPronoun(isAnotherDriver)} had any accidents or claims?`;
export const anyClaimsSubMessageOne = 'Motor accidents or incidents';
export const anyClaimsSubMessageTwo = 'Claims (inc. vandalism, fire or theft, windscreen)';
export const declinedOrCancelledConfirm = 'Was it declined or cancelled?';
export const insuranceVoidedConfirm = 'Was it voided?';
export const specialTermsConfirm = 'Were any special terms imposed?';
export const declinedOrCancelledErrorMessage = 'You must answer yes to one of these questions';
export const cancelledTermsOverlayMessage = "If you, or any drivers you're adding to your policy have ever had insurance refused, had a policy declined or declared void, or had special terms added, we need to know. So, if this has happened, please pick 'Yes'.";

export const cardFaultMessage = 'Fault, ';
export const cardNoFaultMessage = 'No fault, ';
export const cardNcdAffectedMessage = 'NCD affected, ';
export const cardNcdNotAffectedMessage = 'NCD not affected, ';
export const cardInjuriesMessage = 'injuries.';
export const cardNoInjuriesMessage = 'no injuries.';

export const deleteHeader = 'Are you sure?';
export const deleteConfirmMessage = 'Yes';
export const deleteCancelMessage = 'Go back';
export const deleteInfoMessage = (isAnotherDriver) => `This will remove the incident from ${getPossessivePronoun(isAnotherDriver)} quote.`;

export const add = 'Add';
export const update = 'Update';
export const cancel = 'Cancel';
export const incident = 'Incident';
export const incidentDateMessage = 'When did the incident happen?';
export const incidentDateOverlayMessage = 'Please tell us the date the incident occured, not the date a claim was made';
export const accidentTypeMessage = 'What happened?';
export const wasItFaultMessage = 'Was it classed as a fault claim?';
export const affectNcdMessage = (isAnotherDriver) => `Did it affect ${getPossessivePronoun(isAnotherDriver)} no claims discount?`;
export const anyInjuriesMessage = 'Were there any injuries?';
export const addIncidentButton = 'Add another incident';

export const accidentMonthField = 'month';
export const accidentYearField = 'year';
export const accidentTypeName = 'accidentType';
export const wasItMyFaultName = 'wasItMyFault';
export const wasNoClaimsDiscountAffectedName = 'wasNoClaimsDiscountAffected';
export const wereTheirInjuriesName = 'wereTheirInjuries';
export const active = 'active';

export const accidentTypeToRemove = ['U', '0'];
export const remove = 'Remove';
export const edit = 'Edit';
export const claimsInfo = 'Claims Info';

// eslint-disable-next-line max-len
export const dummyToolTip = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquam luctus lorem eget blandit. Donec tempor tortor in ex commodo iaculis sit amet non tortor. Nam pharetra lacus et eros porttitor, sit amet sagittis mi viverra. Phasellus sollicitudin quam non dui rutrum pulvinar. Sed ac metus et lorem aliquam aliquet. Vivamus blandit fringilla dolor, eu egestas felis rhoncus quis. Donec pharetra mattis orci a convallis.';
