import _ from 'lodash';

export default (currentVmNode, question, answers) => {
    return {
        visible: {
            get: () => {
                return _.every(question.filters, (filter) => {
                    if (answers[filter.questionCode] !== undefined) {
                        return answers[filter.questionCode] === filter.answer;
                    }
                    return false;
                });
            }
        },
        required: {
            get: () => {
                return currentVmNode.aspects.visible && question.required;
            }
        }
    };
};
