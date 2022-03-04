
export const pageTitle = 'No claims discount protection';
export const pncdDescriptionOne = 'This protection allows you to make one or more claims without your discount being affected. However,';
export const pncdDescriptionCostTwo = " it won't protect the overall price of your policy, ";
export const pncdDescriptionThree = "which could go up when you come to renew (even if the accident wasn't your fault).";
export const importantInfo = 'Please make sure you read this important information before you continue.';
export const pncdQuestion = 'Do you want to protect your no claims discount?';
export const ncdProtectText = (x) => `You chose to protect your ${x} ${(x > 1 ? ' years' : ' year')} no claims discount (NCD)`;
export const PCW = (x) => ` on ${x}`;
export const ncdCostText = 'Adding NCD protection cost you ';
export const ncdCostAmount = (x) => `£${x ? x.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}`;
export const overlayHeader = 'No claims discount protection';
export const overlayBodyOne = `No claims discount protection does not protect the overall price of your insurance policy.
The price of your insurance policy may increase following an accident even if you were not at fault.`;
export const overlayBodyTwo = `No claims discount  protection allows you to make one or more claims before your number of no claims discount years falls.
Please see the step-back procedures for details.`;
export const overlayBodyThree = (x, y, z) => (
    `This quote includes NCD protection. This increases your premium by 
    £${x ? x.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}.
    You have declared a current NCD of ${y} ${(y > 1 ? ' years' : ' year')}. 
    The tables below show: (i) the average NCD discount awarded
    to ${z} motor insurance policyholders last year according to their number of NCD years; and 
    (ii) what would happen to your NCD years if you were to make one or
    more claims in the next 12 to 36 months with and without this protection. `
);
export const ncdProtectionTableTitle = 'No claims discount at next renewal date ';
export const withoutText = 'without';
export const withText = 'with';
export const ncdProtectionTableTitleOne = ' NCD protection';
export const yearsNCD = (x) => (x > 1 ? ' years NCD' : ' year NCD');
export const tableHeader = 'Step-back table';
export const stepBackTableHeaderOne = 'Number of years NCD';
export const stepBackTableHeaderTwo = 'Average NCD discount last year';
export const ncdProtectionTableHeader = (x, y) => `${x} claims in the next ${y} months`;
export const ncdProtectionTableHeaderOne = (x, y) => `${x} claim in the next ${y} months`;
export const ncdProtectionQuestion = 'Would you like to find out how much it costs to protect your no claims discount (NCD)?'
    + " If you decide you don't want it just select 'No' after you've seen the price.";
export const ncdProtectionHeader = 'No claims discount protection';
export const no = 'No';
export const yes = 'Yes';
export const preselectedText = 'Preselected VIA ';
export const compareText = 'Compare the Market';
export const defaultText = 'Default';
export const clearScore = 'ClearScore';
export const continueMessage = 'Continue';
export const ncdAddedToastMsg = (x) => `Great! You've added no claims discount protection, £${x ? x.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''} has been added to your total price.`;
export const ncdRemoverToastMsg = 'This extra has been removed - your price has been updated.';
export const PAYMENT_TYPE_ANNUALLY_CODE = '1';
export const PAYMENT_TYPE_MONTHLY_CODE = '3';
export const alreadyIncluded = ' (already included in your price). ';
export const years = (x) => (x > 1 || x === 0 ? ' years' : ' year');
export const moreMsg = ' or more';
export const percentage = '%';
export const ancillariesNCD = 'Ancillaries - No claims discount';
export const ancillaries = 'Ancillaries';
export const add = 'Add';
export const remove = 'Remove';
export const summary = 'Summary';
export const spinnerText = 'We\'re working on it...';

export const compareTheMarket = 'CTM';
export const moneySupmarket = 'MSM';
export const confusedCom = 'Confused';
export const goCompare = 'GoCompare';
export const quoteZone = 'Quotezone';
export const uSwitch = 'uSwitch';
export const insurerGroup = 'InsurerGroup';
export const experian = 'Experian';

export const compareTheMarketValue = 'Compare the Market';
export const moneySupmarketValue = 'MoneySupermarket';
export const confusedComValue = 'Confused.com';
export const goCompareValue = 'GoCompare';
export const quoteZoneValue = 'Quotezone';
export const uSwitchValue = 'uSwitch';
export const insurerGroupValue = 'Insurer Group';
export const experianValue = 'Experian';

export const continueRedirect = 'Continue - Redirecting from: HastingsPNCD';
export const directText = 'direct';
export const customizeQuote = 'Customize quote';
export const homePage = 'Go back to the homepage';
