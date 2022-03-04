const getDefaultCurrencyIcon = (countryCode) => {
    switch (countryCode) {
        case 'US':
            return 'usd';
        case 'JP':
            return 'jpy';
        default:
            return 'usd';
    }
};

export default {
    getDefaultCurrencyIcon
};
