import { getPossessivePronoun } from '../__helpers__/pronounHelper';

export const emailTitle = (isAnotherDriver) => `What's ${getPossessivePronoun(isAnotherDriver)} email address?`;
export const emailPlaceholder = 'Email address';
export const infoTitle = 'Important';
export const infoFirstParagraph = 'By giving us your email address you can:';
export const infoSecondParagraphList = ['Get your quote emailed to you.', 'Retrieve any quotes you’ve saved.'];
export const infoThirdParagraph = 'It won\'t be shared with anyone else and, if you buy a policy, it will be used to set up your online account.'
    + ' You can then check or change your details, including email preferences.';
export const invalidEmailMessage = 'Sorry, we don\'t recognise that. Please try again';
export const requiredField = 'Sorry, you need to answer this question';
export const continueLabel = 'Continue';
