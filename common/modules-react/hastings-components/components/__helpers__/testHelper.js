export const defaultTranslator = (messageID = '') => {
    const { defaultMessage = messageID } = messageID;
    return defaultMessage;
};

export const findByTestAttribute = (wrapper, selector) => wrapper.find(`[data-testid='${selector}']`);
