// HDHeader text
export const pageHeaderTitle = 'Before you pay...';
export const pageHeaderParagraph = `You’ve already chosen your cover but here’s where you can fine-tune things.
We’ll take you through some other options you can add on to your policy, to make sure you’ve got everything you need.`;

export const notEligibleInfo = "You can only protect NCD if you have more than a year's discount and haven't made two or more claims where you were at fault in the last four years.";
export const notEligibleTitle = (vehicle) => `Sorry we can't offer NCD protection for the ${vehicle}`;
export const pageTitle = (vehicle) => `No claims discount protection for the ${vehicle}`;
export const vehiclePlaceholder = '{vehicle}';
export const pncdDescriptionOne = 'This protection allows you to make one or more claims without your discount being affected. However,';
export const childPncdDescriptionOne = 'This protection allows them to make one or more claims without their discount being affected. However,';
export const pncdDescriptionCostTwo = " it won't protect the overall price of your policy, ";
export const childPncdDescriptionCostTwo = " it won't protect the overall price of their policy, ";
export const pncdDescriptionThree = "which could go up when you come to renew (even if the accident wasn't your fault).";
export const childPncdDescriptionThree = "which could go up when you come to renew (even if the accident wasn't their fault).";
export const importantInfo = 'Please make sure you read this important information before you continue.';
export const pncdQuestion = 'Do you want to protect your no claims discount?';
export const childPncdQuestion = 'Do you want to protect their no claims discount?';
export const ncdProtectText = (x) => `You chose to protect your ${x} ${(x > 1 ? ' years' : ' year')} no claims discount (NCD)`;
export const childNcdProtectText = (x) => `You chose to protect their ${x} ${(x > 1 ? ' years' : ' year')} no claims discount (NCD)`;
export const PCW = (x) => ` on ${x}`;
export const ncdCostText = 'Adding NCD protection will cost an extra ';
export const ncdCostAmount = (x) => `£${x ? x.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}`;
export const overlayHeader = 'No claims discount protection';
export const overlayBodyOne = `No claims discount protection does not protect the overall price of your insurance policy.
The price of your insurance policy may increase following an accident even if you were not at fault.`;
export const overlayBodyTwo = `No claims discount  protection allows you to make one or more claims before your number of no claims discount years falls.
Please see the step-back procedures for details.`;
export const overlayBodyThree = (x, y, z) => `This quote includes NCD protection. This increases your premium 
by £${x ? x.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}.
You have declared a current NCD of ${y} ${(y > 1 ? ' years' : ' year')}. The tables below show: (i) the average NCD discount awarded
to ${z} motor insurance policyholders last year according to their number of NCD years; and (ii) what would happen to your NCD years if you were to make one or
more claims in the next 12 to 36 months with and without this protection. `;
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
export const ncdProtectionQuestionEventLabel = 'Would you like to find out how much PNCD costs?';
export const no = 'No';
export const yes = 'Yes';
export const preselectedText = 'Preselected on ';
export const compareText = 'Compare the Market';
export const defaultText = 'Default';
export const clearScore = 'ClearScore';
export const continueMessage = 'Continue';
export const ncdAddedToastMsg1 = 'Great! You\'ve added no claims discount protection for ';
export const ncdAddedToastMsg2 = ' at £ ';
export const ncdRemoverToastMsg = 'This extra has been removed - your price has been updated.';
export const mcNcdRemoverToastMsg1 = 'Your cover for ';
export const mcNcdRemoverToastMsg2 = ' won’t include no claims discount protection.';
export const PAYMENT_TYPE_ANNUALLY_CODE = '1';
export const PAYMENT_TYPE_MONTHLY_CODE = '3';
export const alreadyIncluded = '*. (already included in your price) ';
export const years = (x) => (x > 1 || x === 0 ? ' years' : ' year');
export const moreMsg = ' or more';
export const percentage = '%';
export const ancillariesNCD = 'Ancillaries - No claims discount';
export const ancillaries = 'Ancillaries';
export const add = 'Add';
export const remove = 'Remove';
export const summary = 'Summary';
export const spinnerText = 'We\'re working on it...';
export const directText = 'direct';

export const compareTheMarket = 'CTM';
export const moneySupmarket = 'MSM';
export const confusedCom = 'Confused';
export const goCompare = 'GoCompare';
export const quoteZone = 'Quotezone';
export const uSwitch = 'uSwitch';
export const insurerGroup = 'InsurerGroup';
export const experian = 'Experian';

export const compareTheMarketValue = 'Compare the Market';
export const moneySupmarketValue = 'Money Supermarket';
export const confusedComValue = 'Confused.com';
export const goCompareValue = 'Go-compare';
export const quoteZoneValue = 'QuoteZone';
export const uSwitchValue = 'uSwitch';
export const insurerGroupValue = 'Insurer Group';
export const experianValue = 'Experian';

export const continueRedirect = 'Continue - Redirecting from: HastingsMCPNCD';

export const fetchPncdData = 'Fetch PNCD Data';
export const fetchPncdDataFailed = 'Fetching PNCD Data failed';
export const cannotContinueUW = 'Sorry, you wont\'t be able to get a quote today.';
export const cantOfferQuote = "Sorry, we can't offer you a quote";
export const childsQuoteDeclinedButtonLabel = (count) => `Continue with ${count} car`;
export const homePageButtonContent = 'Go back to the homepage';
export const ANCBREAKDOWNCOV_EXT = 'ANCBreakdownCov_Ext';
export const Breakdown = 'Breakdown';
export const ddContinueOriginalQuote = 'Continue with original quote';
export const ddContinuePayInFull = 'Continue and pay in full';
export const roadside = 'Roadside';
export const roadsideRecovery = 'Roadside and recovery';
export const roadsideRecoveryCase = 'Roadside and Recovery';
export const roadsideRecoveryHome = 'Roadside, recovery and at home';
export const roadsideRecoveryHomeEuropean = 'Roadside, recovery, at home and European';
export const homestart = 'Homestart';
export const european = 'European';
export const missingMonthlyPaymentsModalHeader = 'Important';
export const noDDModalContentOne = 'We\'re sorry, we can\'t offer you the option to pay monthly. This is because based on the details you\'ve told us for the '
    + 'additional car, you don\'t meet our lending criteria';
export const noDDModalContentTwo = 'Keep this policy and pay in full today. Or remove the additional car and pay monthly for a policy with just one car';
export const noDDModalYouCan = 'You can:';
