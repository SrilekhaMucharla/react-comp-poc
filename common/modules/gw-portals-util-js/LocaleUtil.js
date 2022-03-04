export default {
    sortProperties: (items, locale, attribute, descending) => {
        // 'kn' will use numeric collation ('1' < '2' < '10')
        const locales = `${locale.replace('_', '-')}-u-kn-true`;
        return items.slice().sort((x, y) => {
            const xValue = x && x[attribute] ? x[attribute] : '';
            const yValue = y && y[attribute] ? y[attribute] : '';
            const comparisonResult = xValue.localeCompare(yValue, locales);
            return descending ? -comparisonResult : comparisonResult;
        });
    }
};
