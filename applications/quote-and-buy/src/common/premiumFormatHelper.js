export const getAmountAsTwoDecimalDigit = (amount) => {
    return (amount && (typeof amount) === 'number') ? amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : amount;
};

export const getAmountAsTwoDecimalDigitsOrWhole = (_amount) => {
    // eslint-disable-next-line no-restricted-globals
    if (!_amount || isNaN(_amount)) return _amount;
    return Number.isInteger(_amount)
        ? Math.abs(_amount).toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
        : Math.abs(_amount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default getAmountAsTwoDecimalDigit;
