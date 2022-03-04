export default (question, translator) => {
    const choices = question.choices.map((choice) => {
        return {
            code: choice.choiceCode,
            name: translator(choice.displayKey)
        };
    });

    return {
        availableValues: {
            value: choices
        }
    };
};
