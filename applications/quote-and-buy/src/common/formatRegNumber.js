/**
 * Formats registration number according to hardcoded regexes, via capture groups.
 * Use with useMemo if component rerenders often.
 * @param {string} regNumber registration number to be formatted
 * @returns {string} formatted registration number
 */
const formatRegNumber = (regNumber) => {
    const regexes = [
        /(^[A-Z]{2}[0-9]{2})(\s?)([A-Z]{3}$)/,
        /(^[A-Z]{1,3})(\s?)([0-9]{1,4}$)/
    ];
    const matchedRegex = regexes.find((regex) => regex.test(regNumber));
    return matchedRegex ? regNumber.replace(matchedRegex, '$1 $3') : regNumber;
};

export default formatRegNumber;
