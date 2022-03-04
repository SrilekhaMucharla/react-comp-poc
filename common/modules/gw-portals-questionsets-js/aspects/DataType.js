const INPUT_TYPES = {
    Choice: 'typelist',
    String: 'text',
    Boolean: 'boolean',
    Integer: 'number',
    Date: 'date'
};

export default (question) => {
    return {
        inputCtrlType: {
            get: () => {
                return INPUT_TYPES[question.questionType];
            }
        }
    };
};
