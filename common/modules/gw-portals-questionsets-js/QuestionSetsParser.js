import _ from 'lodash';
import QuestionSetsViewModel from './QuestionSetsViewModel';

/**
 * Retrieves questionSet from QuestionSets metadata
 * @param {string} qsName
 * @param {object} metadata
 * @throws Will throw an error if questionSet does not exist in QuestionSets metadata
 * @returns {object} - The single question from questionSets metadata
 */
function getQuestionSet(qsName, metadata) {
    const questionSet = metadata[qsName];
    if (!questionSet || !questionSet.orderedQuestions) {
        throw new Error(`There is no question set loaded with the name ${qsName}`);
    }
    return questionSet;
}

export default class QuestionSetsParser {
    /**
     * @throws Will throw an error if questionSetsSubmissionValue is not provided
     * @param {object} questionSetsSubmissionValue
     * @param {object} metadata
     * @param {function} translator
     */
    constructor(questionSetsSubmissionValue, metadata, translator) {
        // eslint-disable-next-line no-underscore-dangle
        this._viewModel = {};
        this.translator = translator;

        if (
            !_.isObject(questionSetsSubmissionValue)
            && !_.isArray(questionSetsSubmissionValue)
        ) {
            throw new Error('A model object is required for storing answers');
        }

        if (_.isArray(questionSetsSubmissionValue)) {
            questionSetsSubmissionValue.forEach((submissionValue) => {
                // eslint-disable-next-line no-underscore-dangle
                this._createViewModel(submissionValue, metadata);
            });
        } else {
            // eslint-disable-next-line no-underscore-dangle
            this._createViewModel(questionSetsSubmissionValue, metadata);
        }
    }

    /**
     * Creates viewModel based on questionSet
     * @param {object} submissionValue - The submission value object
     * @param {string} submissionValue.code - QuestionSet code
     * @param {array} submissionValue.answers - QuestionSet available answers
     * @param {object} metadata
     * @returns {object} - viewModel
     */
    // eslint-disable-next-line consistent-return, no-underscore-dangle
    _createViewModel(submissionValue, metadata) {
        // if view model already created then just return that object
        if (submissionValue.aspects
            && submissionValue.questions
            && _.isArray(submissionValue.questions)) {
            return submissionValue;
        }

        const questionSet = getQuestionSet(submissionValue.code, metadata);
        questionSet.orderedQuestions.sort((a, b) => a.order - b.order)
            .forEach((question) => {
                const answer = submissionValue.answers[question.code];
                if (typeof answer === 'boolean') {
                    // eslint-disable-next-line no-param-reassign
                    submissionValue.answers[question.code] = answer ? 'true' : 'false';
                }
                if (question.questionType === 'Integer' && answer === null) {
                    // eslint-disable-next-line no-param-reassign
                    submissionValue.answers[question.code] = '';
                }
                // eslint-disable-next-line no-underscore-dangle
                this._viewModel[question.code] = new QuestionSetsViewModel(
                    question, submissionValue, this.translator
                );
                const values = question.choices.map((choice) => {
                    return {
                        code: choice.choiceCode,
                        name: this.translator({
                            id: choice.displayKey,
                            defaultMessage: choice.choiceCode
                        })
                    };
                });
                // eslint-disable-next-line no-underscore-dangle
                _.extend(this._viewModel[question.code].aspects.availableValues, values);
            });
        // eslint-disable-next-line no-underscore-dangle
        this._viewModel = _.merge({}, this._viewModel, submissionValue);
    }

    /**
     * Returns the viewModel created via parser
     * @returns {ViewModel} - The viewModel type based on questionSets
     */
    get viewModel() {
        // eslint-disable-next-line no-underscore-dangle
        return this._viewModel;
    }

    /**
     * Returns presentation metadata based on viewModel and questionSets properties
     * @returns {object} - Presentation metadata used to render questionSets fields
     */
    get presentationMetadata() {
        const pageContent = [];
        // eslint-disable-next-line no-underscore-dangle
        _.forOwn(this._viewModel, (question, key) => {
            // eslint-disable-next-line no-underscore-dangle
            if (QuestionSetsParser.filterQuestionSets(key) && this._viewModel[key]) {
                // eslint-disable-next-line no-underscore-dangle
                const field = this._viewModel[key];
                const metadataContent = {
                    id: key,
                    type: 'field',
                    componentProps: {
                        label: { id: field.label, defaultMessage: field.label },
                        layout: 'reversed',
                        path: key
                    }
                };

                if (field.aspects.inputCtrlType === 'typelist') {
                    metadataContent.componentProps.placeholder = {
                        id: 'platform.questionsets.question-set.-- Choose --',
                        defaultMessage: '-- Choose --'
                    };
                }

                pageContent.push(metadataContent);
            }
        });
        return { content: pageContent };
    }

    /**
     * Search for questions only, ignoring answers and code
     * @param {string} key
     * @returns {boolean}
     */
    static filterQuestionSets(key) {
        return key !== 'answers' && key !== 'code';
    }
}
