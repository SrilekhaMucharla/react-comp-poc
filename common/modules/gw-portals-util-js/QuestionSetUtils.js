/**
 * This function will reset any previously selected answers if main question is selected "No"
 *  @param {Object} qsOrderedQuestions ordered question set data
 *  @param {boolean} value user selected value
 *  @param {string} key question code
 *  @param {object} answer answer to the question code
 */
function cleanDependantQuestions(qsOrderedQuestions, value, key, answer) {
    qsOrderedQuestions.forEach((obj) => {
        obj.filters.forEach((element) => {
            if (element.questionCode === key && element.answer !== value.toString()) {
                // eslint-disable-next-line no-param-reassign
                answer[obj.code] = null;
            }
        });
    });
}

export default {
    cleanDependantQuestions
};
