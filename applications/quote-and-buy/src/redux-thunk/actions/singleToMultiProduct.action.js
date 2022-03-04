/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import HDQuoteService from '../../api/HDQuoteService';
import {
    SINGLE_TO_MULTI_PRODUCT_START,
    SINGLE_TO_MULTI_PRODUCT_SUCCESS,
    SINGLE_TO_MULTI_PRODUCT_FAIL
} from '../action.types';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';
import { setErrorStatusCode } from './errorStatusCode.action';
import { removeDataBasedOnPeriodStatus, removeOfferings } from '../../common/submissionMappers/helpers';

// TODO:Temperory fix for inception date from multicar. START
const cloneViewModel = (viewModel) => _.cloneDeep(viewModel);

const getDataForCreateSubmissionAPICall = (submission) => {
    const dataObject = cloneViewModel(submission);
    removeDataBasedOnPeriodStatus(dataObject, ['Quoted', 'Draft']);
    removeOfferings(dataObject);
    return dataObject;
};
// TODO:Temperory fix for inception date from multicar. END

export const singleToMultiProduct = (submissionVM, MCsubmissionVM) => (dispatch) => {
    dispatch({
        type: SINGLE_TO_MULTI_PRODUCT_START
    });
    HDQuoteService.singleToMultiProduct(getDataForCreateSubmissionAPICall(submissionVM.value))
        .then(({ result }) => {
            dispatch({
                type: SINGLE_TO_MULTI_PRODUCT_SUCCESS,
                payload: result
            });
            trackAPICallSuccess('Single Car to Multi Car');
        }).catch((error) => {
            dispatch(setErrorStatusCode(error.status));
            dispatch({
                type: SINGLE_TO_MULTI_PRODUCT_FAIL,
                payload: error
            });
            trackAPICallFail('Single Car to Multi Car', 'Single Car to Multi Car Failed');
        });
};
