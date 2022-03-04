/* eslint-disable import/prefer-default-export */
import * as messages from './HDAutomaticUpgradeMessages';

export const coveragesArray = [{ name: messages.courtesyCar, values: [true, true] },
    { name: messages.helpline, values: [true, true] },
    { name: messages.euCover, values: [true, true] },
    { name: messages.otherCar, values: [true, true] },
    { name: messages.managePolicy, values: [true, true] },
    { name: messages.Windscreen, values: [true, true] },
    { name: messages.vandalism, values: [true, true] },
    { name: messages.uninsuredDriver, values: [true, true] },
    { name: messages.personalCover, values: [true, true] }];

export const coveragesArrayTPFT = [{ name: messages.courtesyCar, values: [true, true] },
    { name: messages.helpline, values: [true, true] },
    { name: messages.euCover, values: [true, true] },
    { name: messages.otherCar, values: [true, true] },
    { name: messages.managePolicy, values: [true, true] },
    { name: messages.Windscreen, values: [false, false] },
    { name: messages.vandalism, values: [false, false] },
    { name: messages.uninsuredDriver, values: [false, false] },
    { name: messages.personalCover, values: [false, false] }];
