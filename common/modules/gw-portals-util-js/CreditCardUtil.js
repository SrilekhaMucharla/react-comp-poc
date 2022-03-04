const creditCardMasks = {
    amex: {
        mask: '9999-999999-99999'
    },
    dinersclub: {
        mask: '9999-999999-9999'
    },
    discover: {
        mask: '9999-9999-9999-9999'
    },
    mastercard: {
        mask: '9999-9999-9999-9999'
    },
    visa: {
        mask: '9999-9999-9999-9999'
    }
};

const defaultCardType = 'visa';

export default {

    getInputMaskForIssuerCode: (code = defaultCardType) => creditCardMasks[code].mask,
    getDefaultCardMask: () => {
        return defaultCardType;
    },

};
