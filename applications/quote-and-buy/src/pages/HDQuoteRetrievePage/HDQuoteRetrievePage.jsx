// TODO : This page is created to test the retrieve API call
// we will be improving and changing this page once we will get the signed off story
import React, {
    useEffect,
    useState,
    useContext
} from 'react';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
    HDAlert
} from 'hastings-components';
import HastingsInterstitialPageHelper from '../HastingsInterstitialPageContainer/HastingsInterstitialPageHelper';
import {
    retrieveQuote as retrieveQuoteAction,
    setSubmissionVM as setSubmissionVMAction,
    setOfferedQuotesDetails
} from '../../redux-thunk/actions';
import useFullscreenLoader from '../Controls/Loader/useFullscreenLoader';
import routes from '../../routes/WizardRouter/RouteConst';
import initialSubmission from '../../routes/SubmissionVMInitial';
import { TranslatorContext } from '../../integration/TranslatorContext';

const SEARCH = 'search';
const ERROR_MESSAGE = 'Please check your data';

function HDQuoteRetrievePage(props) {
    const {
        location, dispatch, retrieveQuote, history, retrieveQuoteObject, setSubmissionVM, submissionVM
    } = props;
    const [quoteStatus, setQuoteStatus] = useState(null);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    let paramvalues;
    const translator = useContext(TranslatorContext);

    useEffect(() => {
        if (_.has(location, SEARCH)) {
            paramvalues = location.search;
            const parsedParams = HastingsInterstitialPageHelper.HandleQueryParams(paramvalues);
            if (parsedParams.quoteID === 123456789) {
                setQuoteStatus(ERROR_MESSAGE);
            } else {
                dispatch(
                    retrieveQuote(parsedParams, translator),
                );
                showLoader();
            }
        // eslint-disable-next-line no-useless-return
        } else { return; }
    }, []);

    const viewModelService = useContext(ViewModelServiceContext);
    const [submissionVMCreated, setSubmissionVMCreated] = useState(false);
    if (viewModelService) {
        if (!submissionVMCreated) {
            dispatch(setSubmissionVM({
                submissionVM: viewModelService.create(
                    initialSubmission,
                    'pc',
                    'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
                ),
            }));
            setSubmissionVMCreated(true);
        }
    }

    useEffect(() => {
        setQuoteStatus(null);
        if (retrieveQuoteObject && retrieveQuoteObject.retrieveQuoteError) {
            hideLoader();
            setQuoteStatus(ERROR_MESSAGE);
        }
        if (_.get(retrieveQuoteObject, 'retrieveQuoteObj') && Object.keys(retrieveQuoteObject.retrieveQuoteObj).length > 0) {
            if (_.has(location, 'search') && _.get(retrieveQuoteObject, 'retrieveQuoteObj.quoteID')) {
                hideLoader();
                paramvalues = location.search;
                const parsedParams = HastingsInterstitialPageHelper.HandleQueryParams(paramvalues);
                let offeredQuotes = retrieveQuoteObject.retrieveQuoteObj.quoteData.offeredQuotes || [];
                offeredQuotes = offeredQuotes || [];
                const filteredOfferedQuotes = offeredQuotes.filter((offeredQuotesObj) => {
                    return offeredQuotesObj.branchCode === parsedParams.productBand;
                });
                dispatch(
                    setOfferedQuotesDetails(filteredOfferedQuotes),
                );
                _.set(submissionVM.value, 'baseData', retrieveQuoteObject.retrieveQuoteObj.baseData);
                _.set(submissionVM.value, 'bindData', retrieveQuoteObject.retrieveQuoteObj.bindData);
                _.set(submissionVM.value, 'lobData', retrieveQuoteObject.retrieveQuoteObj.lobData);
                _.set(submissionVM.value, 'quoteData', retrieveQuoteObject.retrieveQuoteObj.quoteData);
                _.set(submissionVM.value, 'quoteID', retrieveQuoteObject.retrieveQuoteObj.quoteID);
                _.set(submissionVM.value, 'sessionUUID', retrieveQuoteObject.retrieveQuoteObj.sessionUUID);

                history.push({
                    pathname: routes.ADD_ANOTHER_DRIVER
                });
            } else {
                hideLoader();
                setQuoteStatus(ERROR_MESSAGE);
            }
        }
    }, [dispatch, retrieveQuoteObject, submissionVM]);

    return (
        <>
            <div className="interstitial-container">
                {_.get(retrieveQuoteObject, 'retrieveQuoteError.error.message') && (
                // eslint-disable-next-line indent
                    <p className="error">{retrieveQuoteObject.retrieveQuoteError.error.message}</p>
                )}
                {quoteStatus !== null && <HDAlert message={quoteStatus} />}
            </div>
            {HDFullscreenLoader}
        </>
    );
}

const mapStateToProps = (state) => ({
    retrieveQuoteObject: state.retrieveQuoteModel,
    submissionVM: state.wizardState.data.submissionVM,
});

const mapDispatchToProps = (dispatch) => ({
    retrieveQuote: retrieveQuoteAction,
    setSubmissionVM: setSubmissionVMAction,
    setOfferedQuotesDetails,
    dispatch,
});
HDQuoteRetrievePage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    retrieveQuote: PropTypes.func.isRequired,
    retrieveQuoteObject: PropTypes.shape({
        retrieveQuoteObj: PropTypes.shape({
            quoteData: PropTypes.shape({
                offeredQuotes: PropTypes.array
            }),
            bindData: PropTypes.shape({}),
            lobData: PropTypes.shape({}),
            quoteID: PropTypes.string,
            sessionUUID: PropTypes.string,
            baseData: PropTypes.shape({
                periodStatus: PropTypes.string,
            }),
        }),
        retrieveQuoteError: PropTypes.shape({
            error: PropTypes.shape({
                message: PropTypes.string,
            }),
        }),
    }).isRequired,
    setSubmissionVM: PropTypes.func.isRequired,
    location: PropTypes.shape({
        search: PropTypes.string.isRequired
    }).isRequired,
    submissionVM: PropTypes.shape({
        value: PropTypes.shape({})
    }).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDQuoteRetrievePage);
