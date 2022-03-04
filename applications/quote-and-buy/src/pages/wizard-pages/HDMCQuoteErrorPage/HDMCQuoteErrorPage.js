import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import {
    HDLabelRefactor
} from 'hastings-components';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { AnalyticsHDButton as HDButton, AnalyticsHDModal as HDModal } from '../../../web-analytics';
import * as messages from './HDMCQuoteErrorPage.messages';
import HDSavingsPageCard from '../HDSavingsPage/HDSavingsPageCard';
import {
    setNavigation as setNavigationAction,
    setErrorStatusCode,
    resetCurrentPageIndex as resetCurrentPageIndexAction,
    setVehicleDetails,
    clearmultiQuoteData,
    clearmultiToSingleQuoteData
} from '../../../redux-thunk/actions';
import useToast from '../../Controls/Toast/useToast';
import EventEmmiter from '../../../EventHandler/event';
import { getMultiToSingleParam, getNumberAsString } from '../../../common/utils';
import { checkHastingsError } from '../../../common/submissionMappers/helpers';
import routes from '../../../routes/WizardRouter/RouteConst';
import HDQuoteService from '../../../api/HDQuoteService';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import { getDataForMultiQuoteAPICallWithUpdatedFlag } from '../../../common/submissionMappers';
import mcsubmission from '../../../routes/MCSubmissionVMInitial';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import { getDataForMultiQuote } from '../../../redux-thunk/actions/multiQuote.action';
import {
    multiToSingle, multiToSingleFailed
} from '../../HDMCIntroPage/HDMCIntroPage.messages';
import trackQuoteData from '../../../web-analytics/trackQuoteData';
import { TranslatorContext } from '../../../integration/TranslatorContext';

const HDMCQuoteErrorPage = ({
    submissionVM,
    mcsubmissionVM,
    setNavigation,
    multiCarFlag,
    resetCurrentPageIndex,
    pageMetadata
}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const translator = useContext(TranslatorContext);
    const [showRemoveCarModal, setShowRemoveCarModal] = useState(false);
    const [removedQuoteID, setRemovedQuoteID] = useState(null);
    const history = useHistory();
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [HDToast, addToast] = useToast();
    const carCardsWithError = [];
    const carCards = [];
    const errorsQuoteID = [];

    useEffect(() => {
        dispatch(clearmultiQuoteData());
        dispatch(clearmultiToSingleQuoteData());
        EventEmmiter.dispatch('change', { price: null });
        resetCurrentPageIndex();
    }, []);

    useEffect(() => {
        if (_.has(location, 'state')) {
            const paramvalues = location.state;
            if (paramvalues && paramvalues.SaveAndReturn) {
                addToast({
                    iconType: 'tick',
                    bgColor: 'light',
                    content: messages.welcomeBack
                });
            }
        }
    }, []);


    setNavigation({ canSkip: false, showForward: false });

    const removeCarHandler = (quoteID) => {
        setRemovedQuoteID(quoteID);
        setShowRemoveCarModal(true);
    };

    // For checking hastings error
    const checkHastingsErrorHandler = (quote) => {
        const errorObject = checkHastingsError(quote);
        if (!errorObject.errorCode) {
            return false;
        }
        return true;
    };

    const modalConfirmHandler = () => {
        dispatch(setNavigation({
            showHidePromotionalPage: true
        }));
        if (mcsubmissionVM.value.quotes.length > 2) {
            HDQuoteService.multiQuote(getDataForMultiQuote(mcsubmissionVM, removedQuoteID, false))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', result);
                    // mcsubmission.value.quote.map( => checkHastingsErrorHandler(quote))
                    // if returns true then check isParentPolicy for that quote is type, then navigate to quote decline page
                    // if method erturns true for any of the child car then stay in this page
                    // if method returns false for all cars then navigate to savings page
                    let hasError = false;
                    let hasParentError = false;
                    if (result) {
                        mcsubmissionVM.value.quotes.map((quote) => {
                            if (checkHastingsErrorHandler(quote)) {
                                hasError = true;
                                if (quote.isParentPolicy) {
                                    hasParentError = true;
                                }
                            }
                            return null;
                        });
                        if (hasError && hasParentError) {
                            history.push(routes.QUOTE_DECLINE);
                        }
                        if (!hasError) {
                            history.push(routes.MC_SAVINGS_PAGE);
                        }
                    }
                    trackQuoteData(result, translator);
                    trackAPICallSuccess('Multi Quote');
                    hideLoader();
                }).catch((error) => {
                    dispatch(setErrorStatusCode(error.status));
                    trackAPICallFail('Multi Quote', 'Multi Quote Failed');
                    hideLoader();
                });
        } else if (mcsubmissionVM.value.quotes.length === 2) {
            showLoader();
            HDQuoteService.multiToSingleQuote(getMultiToSingleParam(mcsubmissionVM))
                .then(({ result }) => {
                    if (multiCarFlag) {
                        setNavigation({ multiCarFlag: false });
                        _.set(mcsubmissionVM, 'value', mcsubmission);
                        _.set(submissionVM, 'value', result);
                        dispatch(setNavigation({
                            quoteID: (result && result.quoteID) || '',
                            sessionUUID: (result && result.sessionUUID) || '',
                            isEditQuoteJourney: false,
                            softSellJourney: false
                        }));
                        dispatch(setVehicleDetails({}));
                        history.push(routes.YOUR_QUOTES);
                    } else {
                        EventEmmiter.dispatch('change', { price: null });
                        hideLoader();
                    }
                    trackAPICallSuccess(multiToSingle);
                }).catch((error) => {
                    EventEmmiter.dispatch('change', { price: null });
                    hideLoader();
                    setErrorStatusCode(error.status);
                    trackAPICallFail(multiToSingle, multiToSingleFailed);
                });
        }
        setShowRemoveCarModal(false);
        showLoader();
    };

    const modalCancelHandler = () => {
        setRemovedQuoteID(null);
        setShowRemoveCarModal(false);
    };

    const generateQuoteCards = () => {
        for (let i = 0; i < mcsubmissionVM.quotes.children.length; i += 1) {
            if (!checkHastingsErrorHandler(mcsubmissionVM.quotes.children[i].value)) {
                carCards.push(
                    <HDSavingsPageCard
                        key={mcsubmissionVM.quotes.children[i].value.quoteID}
                        carInfo={mcsubmissionVM.quotes.children[i]}
                        removeCarHandler={removeCarHandler}
                        showMulticarDiscount={false} />
                );
            } else {
                errorsQuoteID.push(mcsubmissionVM.quotes.children[i].value.quoteID);
                carCardsWithError.push(
                    <HDSavingsPageCard
                        key={mcsubmissionVM.quotes.children[i].value.quoteID}
                        carInfo={mcsubmissionVM.quotes.children[i]}
                        removeCarHandler={removeCarHandler}
                        showMulticarDiscount={false} />
                );
            }
        }
        return (
            <>
                {carCardsWithError.length && <HDLabelRefactor id="quote-error-card" Tag="h2" text={messages.quoteUnavailableTitle} />}
                {carCardsWithError}
                {carCards.length && <HDLabelRefactor id="quote-card" Tag="h2" text={messages.dontWorryTitle} /> }
                {carCards}
                <HDModal
                    id="savings-page-remove-car-modal"
                    webAnalyticsEvent={{ event_action: messages.removeCarModalContent }}
                    webAnalyticsView={{ ...pageMetadata, page_section: `${messages.areYouSure} - continue with one car` }}
                    customStyle="customize-quote-error footer-btns-w-100"
                    show={showRemoveCarModal}
                    headerText={messages.areYouSure}
                    cancelLabel={messages.noRemoveCar}
                    confirmLabel={showRemoveCarModal ? messages.yesRemoveCar : messages.yesContinue}
                    onCancel={modalCancelHandler}
                    onConfirm={modalConfirmHandler}
                    hideClose
                >
                    <span>
                        {showRemoveCarModal ? messages.removeCarModalContent : messages.contOneCarModalContent}
                    </span>
                </HDModal>
            </>
        );
    };
    const deleteErroredSubmissionVMs = () => {
        const mockMCSubmissionVM = _.cloneDeep(mcsubmissionVM.value);
        const mcsubmissionQuotes = _.get(mockMCSubmissionVM, 'quotes', null);
        const filteredQuotes = mcsubmissionQuotes.filter((quote) => !errorsQuoteID.includes(quote.quoteID));
        _.set(mockMCSubmissionVM, 'quotes', filteredQuotes);
        return mockMCSubmissionVM;
    };

    const nCarContClicked = () => {
        dispatch(setNavigation({
            showHidePromotionalPage: true
        }));
        const mockMCSubmissionVM = deleteErroredSubmissionVMs();
        if (mockMCSubmissionVM.quotes.length === 1) {
            showLoader();
            HDQuoteService.multiToSingleQuote(getMultiToSingleParam(mcsubmissionVM))
                .then(({ result }) => {
                    if (multiCarFlag) {
                        setNavigation({ multiCarFlag: false });
                        _.set(mcsubmissionVM, 'value', mcsubmission);
                        _.set(submissionVM, 'value', result);
                        dispatch(setNavigation({
                            quoteID: (result && result.quoteID) || '',
                            sessionUUID: (result && result.sessionUUID) || '',
                            isEditQuoteJourney: false,
                            softSellJourney: false
                        }));
                        dispatch(setVehicleDetails({}));
                        history.push(routes.YOUR_QUOTES);
                    } else {
                        EventEmmiter.dispatch('change', { price: null });
                        hideLoader();
                    }
                    trackAPICallSuccess(multiToSingle);
                }).catch((error) => {
                    EventEmmiter.dispatch('change', { price: null });
                    hideLoader();
                    setErrorStatusCode(error.status);
                    trackAPICallFail(multiToSingle, multiToSingleFailed);
                });
        } else {
            showLoader();
            HDQuoteService.multiQuote(getDataForMultiQuoteAPICallWithUpdatedFlag(mockMCSubmissionVM))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', result);
                    hideLoader();
                    resetCurrentPageIndex();
                    history.push(routes.MC_SAVINGS_PAGE);
                    trackQuoteData(result, translator);
                    trackAPICallSuccess('Multi Quote');
                }).catch((error) => {
                    hideLoader();
                    setErrorStatusCode(error.status);
                    trackAPICallFail('Multi Quote', 'Multi Quote Failed');
                });
        }
    };

    const getContinueNCarLabel = () => {
        return messages.continueOneCar(getNumberAsString(mcsubmissionVM.value.quotes.length - carCardsWithError.length));
    };

    const getContinueButtons = () => {
        return (
            <Row>
                <Col xs={12} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                    <HDButton
                        webAnalyticsEvent={{
                            event_action: getContinueNCarLabel(),
                            event_value: 'Continue one car button'
                        }}
                        id="continue-with-one-car-button"
                        className="w-100 margin-top-md"
                        label={getContinueNCarLabel()}
                        variant="primary"
                        size="md"
                        onClick={nCarContClicked} />
                </Col>
            </Row>
        );
    };

    return (
        <Container className="quote-error-page-container">
            <Row>
                <Col>
                    <div className="cars-container">
                        {generateQuoteCards()}
                    </div>
                    {getContinueButtons()}
                </Col>
            </Row>
            {HDToast}
            {HDFullscreenLoader}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        multiCarFlag: state.wizardState.app.multiCarFlag,
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    resetCurrentPageIndex: resetCurrentPageIndexAction,
    clearmultiQuoteData,
    clearmultiToSingleQuoteData
};

HDMCQuoteErrorPage.propTypes = {
    submissionVM: PropTypes.shape({
        lobData: PropTypes.object,
        baseData: PropTypes.object,
        aspects: PropTypes.object
    }).isRequired,
    mcsubmissionVM: PropTypes.shape({ value: PropTypes.object, quotes: PropTypes.object }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    resetCurrentPageIndex: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCQuoteErrorPage);
