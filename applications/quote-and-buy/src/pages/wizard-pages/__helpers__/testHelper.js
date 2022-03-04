const defaultTranslator = (messageID = '') => {
    let wrappedKey = messageID;
    if (typeof messageID !== 'object') {
        return messageID;
    }
    if (typeof messageID.id === 'object') {
        wrappedKey = messageID.id;
    }
    const { id = null, defaultMessage = 'defaultTranslator mock: missing both message and default message' } = wrappedKey;
    return id || defaultMessage;
};

export default defaultTranslator;
