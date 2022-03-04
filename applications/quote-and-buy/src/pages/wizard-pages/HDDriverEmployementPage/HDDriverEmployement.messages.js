/* eslint-disable max-len */
import {
    getPersonalPronoun, getPossessivePronoun, getPossessivePronounTheir, getPossessivePronounSmallercase
} from '../__helpers__/pronounHelper';

export const required = 'Sorry, you need to answer this question';
export const typeOfStudent = (isAnotherDriver) => `What type of student are ${getPersonalPronoun(isAnotherDriver)}?`;
export const occupation = (isAnotherDriver) => `What do ${getPersonalPronoun(isAnotherDriver)} do?`;
export const occupationLabelToolTipHeader = '';
export const occupationLabelToolTipBody = 'Lorem ipsum dolor sit amet'
+ 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
+ ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
+ 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
+ ' Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
export const employmentStatus = (isAnotherDriver) => `What's ${getPossessivePronoun(isAnotherDriver)} employment status?`;
export const employmentStatusToolTipsHeader = (isAnotherDriver) => `What's ${getPossessivePronoun(isAnotherDriver)} employment status?`;
export const employmentStatusToolTipsBody = (isAnotherDriver) => `If more than one of these applies, pick the one that ${getPersonalPronoun(isAnotherDriver)} do most. For example, `
+ `if ${getPossessivePronoun(isAnotherDriver)} main role is looking after ${getPossessivePronoun(isAnotherDriver)} home, but ${getPersonalPronoun(isAnotherDriver)} also have a part-time job, choose 'household duties'.`;

export const infocardTitle = 'Tip!';
export const infocardBody = (isAnotherDriver) => `This should be ${getPossessivePronounSmallercase(isAnotherDriver)} main job. Don't worry if you can't find ${getPossessivePronounTheir(isAnotherDriver)} exact job title. Try describing it differently or pick the closest match.`;
export const noneHouseHoldDuties = 'None - Household Duties';
export const noneHouseHoldDutiesCode = '948';
export const unemployedCode = 'U03';
export const notEmployedDisabilityCode = '43D';
export const retiredCode = 'R09';
export const independentMeansCode = 'I02';
export const notInEmployementCode = '186';
export const noneUnemployedCode = '747';
export const noneUnemployedDueToDisabilityCode = '949';
export const noneRetired = '947';
export const studentFilter = 'InFullOrPartTimeEducation';
export const houseHoldDutiesMaleFilter = 'houseHoldDutiesMale';
export const houseHoldDutiesFemaleFilter = 'houseHoldDutiesFemale';

// secondary employement
export const anotherJob = (isAnotherDriver) => `Do ${getPersonalPronoun(isAnotherDriver)} have another job?`;
export const anotherJobToolTipHeader = '';
export const anotherJobToolTipBody = 'Lorem ipsum dolor sit amet'
+ 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
+ ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
+ 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
+ ' Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
export const whatIsIt = 'What is it?';
export const whatIsItToolTipHeader = '';
export const whatIsItToolTipBody = 'Lorem ipsum dolor sit amet'
+ 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
+ ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
+ 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
+ ' Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

// universal
export const trueVal = 'true';
export const falseVal = 'false';
export const yes = 'Yes';
export const no = 'No';
export const check = 'check';
export const times = 'times';
export const genericInputPlaceholder = 'Start typing...';
export const househusband = 'Househusband';
export const housewife = 'Housewife';
export const employedCode = 'E';

export const industry = 'What industry is this?';
export const industryToolTipHeader = '';
export const industryToolTipBody = 'Lorem ipsum dolor sit amet'
+ 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
+ ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
+ 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
+ ' Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
export const dropdownTheme = 'blue';
export const employmentStatusLabel = 'Employment Status';
export const maritalStatus = 'Marital Status';
export const childrenUnder16 = 'Children Under 16';
export const homeOwner = 'Home Owner';
export const errorMessage = 'Sorry, you need to answer this question';
