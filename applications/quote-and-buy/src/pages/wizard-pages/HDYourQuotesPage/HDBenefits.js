import * as messages from './HDYourQuotesPage.messages';

export const drivingOtherCarsBenefit = 'Driving other cars';

export const essential = [
    { benefit: 'Courtesy car', description: 'For the duration of your repair' },
    { benefit: '90 days of EU Cover', description: 'Up to 90 days per trip' },
    { benefit: '24/7 claims helpline', description: 'Available 24/7' },
    { benefit: '24/7 online account access', description: 'Available 24/7' }];
export const directTP = [
    { benefit: 'Courtesy car', description: 'For the duration of your repair' },
    { benefit: '90 days of EU Cover', description: 'Up to 90 days per trip' },
    { benefit: '24/7 claims helpline', description: 'Available 24/7' },
    { benefit: '24/7 online account access', description: 'Available 24/7' },
    { benefit: drivingOtherCarsBenefit, description: 'Third party cover' }];
export const directComp = [
    { benefit: 'Courtesy car', description: 'For the duration of your repair' },
    { benefit: '90 days of EU Cover', description: 'Up to 90 days per trip' },
    { benefit: '24/7 claims helpline', description: 'Available 24/7' },
    { benefit: '24/7 online account access', description: 'Available 24/7' },
    { benefit: 'Windscreen cover', description: 'Repair or replacement' },
    { benefit: 'Uninsured driver promise', description: 'No excess to pay' },
    { benefit: drivingOtherCarsBenefit, description: 'Third party cover' },
    { benefit: 'Personal belongings cover', description: 'Personal belongings cover' },
    { benefit: 'Vandalism promise', description: 'Vandalism promise' }];
export const directCompYAndI = [
    { benefit: 'Courtesy car', description: 'For the duration of your repair' },
    { benefit: '24/7 claims helpline', description: 'Available 24/7' },
    { benefit: '24/7 online account access', description: 'Available 24/7' },
    { benefit: 'Windscreen cover', description: 'Repair or replacement' },
    { benefit: 'Uninsured driver promise', description: 'No excess to pay' },
    { benefit: 'Personal belongings cover', description: 'Personal belongings cover' },
    { benefit: 'Vandalism promise', description: 'Vandalism promise' }];
export const premierComp = [
    { benefit: 'Courtesy car', description: 'For the duration of your repair' },
    { benefit: '90 days of EU Cover', description: 'Up to 90 days per trip' },
    { benefit: '24/7 claims helpline', description: 'Available 24/7' },
    { benefit: '24/7 online account access', description: 'Available 24/7' },
    { benefit: 'Roadside assistance', description: 'With the RAC' },
    { benefit: 'Windscreen cover', description: 'Repair or replacement' },
    { benefit: 'Uninsured driver promise', description: 'No excess to pay' },
    { benefit: 'Legal expenses cover', description: 'Up to 100,000' },
    { benefit: drivingOtherCarsBenefit, description: 'Third party cover' },
    { benefit: 'Personal belongings cover', description: 'Personal belongings cover' },
    { benefit: 'Vandalism promise', description: 'Vandalism promise' }];
export const premierCompYAndI = [
    { benefit: 'Courtesy car', description: 'For the duration of your repair' },
    { benefit: '24/7 claims helpline', description: 'Available 24/7' },
    { benefit: '24/7 online account access', description: 'Available 24/7' },
    { benefit: 'Roadside assistance', description: 'With the RAC' },
    { benefit: 'Windscreen cover', description: 'Repair or replacement' },
    { benefit: 'Uninsured driver promise', description: 'No excess to pay' },
    { benefit: 'Legal expenses cover', description: 'Up to 100,000' },
    { benefit: 'Personal belongings cover', description: 'Personal belongings cover' },
    { benefit: 'Vandalism promise', description: 'Vandalism promise' }];
export const premierTP = [
    { benefit: 'Courtesy car', description: 'For the duration of your repair' },
    { benefit: '90 days of EU Cover', description: 'Up to 90 days per trip' },
    { benefit: '24/7 claims helpline', description: 'Available 24/7' },
    { benefit: '24/7 online account access', description: 'Available 24/7' },
    { benefit: 'Roadside assistance', description: 'With the RAC' },
    { benefit: 'Legal expenses cover', description: 'Up to 100,000' },
    { benefit: drivingOtherCarsBenefit, description: 'Third party cover' }];
export const commonBenefits = [
    { benefit: 'Check or change policy details' },
    { benefit: 'View documents 24/7' },
    { benefit: 'Report & track a claim' },
    { benefit: 'Manage your payments' },
];

export const BRAND_AVAILABLE_FEATURE = {
    HE: {
        [messages.courtesyCarCovName]: [true, true],
        [messages.claimsHelplineCovName]: [true, true],
        [messages.euCoverLabelCovName]: [true, true],
        [messages.drivingOtherCarsCovName]: [true, true],
        [messages.managePolicyCovName]: [true, true],
        [messages.windscreenCoverCovName]: [false, false],
        [messages.vandalismPromiseCovName]: [false, false],
        [messages.uninsuredDriverPromiseCovName]: [false, false],
        [messages.personalBelongingsCoverCovName]: [false, false],
    },
    YD: {
        [messages.courtesyCarCovName]: [true, true],
        [messages.claimsHelplineCovName]: [true, true],
        [messages.euCoverLabelCovName]: [true, true],
        [messages.drivingOtherCarsCovName]: [true, true],
        [messages.managePolicyCovName]: [true, true],
        [messages.windscreenCoverCovName]: [true, false],
        [messages.vandalismPromiseCovName]: [true, false],
        [messages.uninsuredDriverPromiseCovName]: [true, false],
        [messages.personalBelongingsCoverCovName]: [true, false],
    },
    HD: {
        [messages.courtesyCarCovName]: [true, true],
        [messages.claimsHelplineCovName]: [true, true],
        [messages.euCoverLabelCovName]: [true, true],
        [messages.drivingOtherCarsCovName]: [true, true],
        [messages.managePolicyCovName]: [true, true],
        [messages.windscreenCoverCovName]: [true, false],
        [messages.vandalismPromiseCovName]: [true, false],
        [messages.uninsuredDriverPromiseCovName]: [true, false],
        [messages.personalBelongingsCoverCovName]: [true, false],
    },
    HP: {
        [messages.courtesyCarCovName]: [true, true],
        [messages.claimsHelplineCovName]: [true, true],
        [messages.euCoverLabelCovName]: [true, true],
        [messages.drivingOtherCarsCovName]: [true, true],
        [messages.managePolicyCovName]: [true, true],
        [messages.windscreenCoverCovName]: [true, false],
        [messages.vandalismPromiseCovName]: [true, false],
        [messages.uninsuredDriverPromiseCovName]: [true, false],
        [messages.personalBelongingsCoverCovName]: [true, false],
    }
};
