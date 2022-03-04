export default (LocaleService) => {
    return {
        optionalVisibility: (cond, target) => {
            return cond ? target : 'OPTIONAL';
        },
        belongsToFilter: (value, filterName) => {
            return value && value.typelist.getFilter(filterName).allows(value);
        },
        hasCategory: (value, parent) => {
            if (!parent) {
                return false;
            }

            return value.belongsToCategory(parent);
        },
        getContextValue: (context, prop) => {
            return context(prop);
        },
        matchesPattern: (pattern, value) => {
            return !pattern || !value || new RegExp(`^${pattern}$`).test(value);
        },
        typekeyIn: (tk, values) => {
            return values.indexOf(tk.code) >= 0;
        },
        range: (l, r, m) => {
            return l <= m && m <= r;
        },
        decimalRange: (l, r, m) => {
            return l <= m && m <= r;
        },
        strLength: (s) => {
            return s ? s.length : 0;
        },
        arrLength: (a) => {
            return a ? a.length : 0;
        },
        getFromMap: (m, k) => {
            return m[k];
        },
        compareDate: (d1, d2) => {
            return new Date(d1).getTime() - new Date(d2).getTime();
        },
        isEmpty: (s1) => {
            return !s1 || s1.length === 0;
        },
        isCurrency: (obj) => {
            if (obj === undefined || obj === null || obj === '') {
                return false;
            }

            if (typeof obj === 'number') {
                // eslint-disable-next-line no-param-reassign
                obj = obj.toString();
            }

            if (typeof obj !== 'string') {
                return false;
            }

            if (!obj.match(/^\d*(.\d*)?$/)) {
                return false;
            }

            const currencyInfo = LocaleService
                ? LocaleService.getLocaleInfo().currency
                : { fractionSize: 2 };
            return obj.indexOf('.') === -1 || obj.indexOf('.') >= obj.length - (currencyInfo.fractionSize + 1);
        }
    };
};
