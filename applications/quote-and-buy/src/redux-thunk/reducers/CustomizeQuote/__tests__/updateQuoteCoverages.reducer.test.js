import reducer from '../updateQuoteCoverages.reducer';
import * as types from '../../../action.types';
import mockSubmission from '../../../../routes/SubmissionVMInitial';

const payload = mockSubmission;
const INITIAL_STATE = {
    quoteCoveragesObj: {},
    quoteCoveragesError: null
};
const errorMessages = {
    error: {
        message: 'ErrorCode: -32602-INVALID_PARAMS ErrorMessage: com.fasterxml.jackson.databind.JsonMappingException:'
        + 'Unknown method name: updateQuoteCoveragesc',
        code: -32602
    },
    jsonrpc: '2.0'
};

describe('INITIAL_STATE', () => {
    test('is correct', () => {
        expect(reducer(undefined, {})).toEqual(INITIAL_STATE);
        expect(reducer(undefined, {})).toMatchSnapshot();
    });
});

describe('UPDATE_QUOTE_COVERAGES_SUCCESS', () => {
    test('returns the correct state', () => {
        const action = { type: types.UPDATE_QUOTE_COVERAGES_SUCCESS, payload: payload };
        expect(reducer(undefined, action)).toMatchSnapshot();
    });
});

describe('UPDATE_QUOTE_COVERAGES_FAIL', () => {
    test('returns the error state', () => {
        const action = { type: types.UPDATE_QUOTE_COVERAGES_FAIL, payload: errorMessages };
        expect(reducer(undefined, action)).toMatchSnapshot();
    });
});
