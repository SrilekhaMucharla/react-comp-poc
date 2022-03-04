import _ from 'lodash';
import requiredness from './aspects/Requiredness';
import validity from './aspects/Validity';
import availableValues from './aspects/AvailableValues';
import dataType from './aspects/DataType';

export default class QuestionSetViewModel {
    constructor(question, modelValue, translator) {
        this.question = question;
        this.modelValue = modelValue;
        this.translator = translator;
        // eslint-disable-next-line no-underscore-dangle
        this._aspects = {};

        const aspectProperties = requiredness(this, question, modelValue.answers);
        _.extend(aspectProperties, validity(this, translator));
        _.extend(aspectProperties, availableValues(question, translator));
        _.extend(aspectProperties, dataType(question));

        Reflect.ownKeys(aspectProperties).forEach((propName) => {
            Reflect.defineProperty(this.aspects, propName, aspectProperties[propName]);
        });
    }

    get label() {
        return this.question.displayKey;
    }

    get answer() {
        const answer = this.modelValue.answers[this.question.code];

        switch (answer) {
            // See history. Previous implementation worked by coincidence
            // because of implicit string to boolean conversion by angular.
            // This emulates previous behaviour
            case 'false':
                return false;
            case 'true':
                return true;
            default:
                if (answer && !Number.isNaN((Number(answer)))) {
                    // if the string is a number convert it
                    return Number(answer);
                }
                return answer;
        }
    }

    set answer(answerValue) {
        let returnAnswer = answerValue;

        if (typeof answerValue === 'boolean') {
            // See history. Previous implementation worked by coincidence
            // because of implicit string to boolean conversion by angular.
            // This emulates previous behaviour
            returnAnswer = answerValue ? 'true' : 'false';
        } else if (answerValue && answerValue.code) {
            returnAnswer = answerValue.code;
        }
        this.modelValue.answers[this.question.code] = returnAnswer;
    }

    set value(val) {
        this.answer = val;
    }

    get value() {
        if (this.aspects.inputCtrlType === 'typelist') {
            return this.aspects.availableValues.find((value) => this.answer === value.code);
        }
        return this.answer;
    }

    get aspects() {
        // eslint-disable-next-line no-underscore-dangle
        return this._aspects;
    }

    set aspects(aspects) {
        // eslint-disable-next-line no-underscore-dangle
        this._aspects = aspects;
    }
}
