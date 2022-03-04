import _ from 'lodash';

export default {
    toString(code) {
        const isMissingNecessaryProperties = ['code', 'classification'].some((prop) => !code[prop]);

        if (!code || isMissingNecessaryProperties) {
            return '';
        }

        const classificationValue = _.get(code, 'classification.value', code.classification);
        return `${classificationValue}`;
    }
};
