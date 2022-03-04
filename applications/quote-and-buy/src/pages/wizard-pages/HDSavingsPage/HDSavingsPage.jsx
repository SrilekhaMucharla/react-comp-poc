import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import {
    HDInfoCardRefactor, HDLabelRefactor
} from 'hastings-components';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { AnalyticsHDModal as HDModal, AnalyticsHDButton as HDButton } from '../../../web-analytics';
import * as messages from './HDSavingsPage.messages';
import tipGreenIcon from '../../../assets/images/icons/tip-icon.svg';
import HDSavingsPageCard from './HDSavingsPageCard';
import EventEmmiter from '../../../EventHandler/event';
import {
    setNavigation as setNavigationAction,
    multiQuote as multiQuoteAction,
    multiToSingleQuote as multiToSingleQuoteAction,
    setSubmissionVM as setSubmissionVMAction,
    resetCurrentPageIndex as resetCurrentPageIndexAction,
    setVehicleDetails,
    clearmultiQuoteData,
    clearmultiToSingleQuoteData,
    resetMultiToSingleObject,
    incrementCurrentPageIndex as incrementCurrentPageIndexAction,
} from '../../../redux-thunk/actions';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import { checkHastingsError } from '../../../common/submissionMappers/helpers';
import { getNumberAsString, getUpdateSelectedVersionForMPAPI } from '../../../common/utils';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import mcsubmission from '../../../routes/MCSubmissionVMInitial';
import { getAmountAsTwoDecimalDigit, getAmountAsTwoDecimalDigitsOrWhole } from '../../../common/premiumFormatHelper';
import HDQuoteService from '../../../api/HDQuoteService';
import trackQuoteData from '../../../web-analytics/trackQuoteData';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';


const HDSavingsPage = ({
    mcsubmissionVM, setNavigation, multiQuote, multiQuoteObject, multiQuoteError, multiToSingleQuote, multiToSingleQuoteObject, multiToSingleQuoteError,
    submissionVM, handleForward, multiCarFlag, showedNoRegModal, pageMetadata, resetCurrentPageIndex, isPCWJourney, incrementCurrentPageIndex
}) => {
    const dispatch = useDispatch();
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [showRemoveCarModal, setShowRemoveCarModal] = useState(false);
    const [showContOneCarModal, setShowContOneCarModal] = useState(false);
    let carsWithoutRegNum = 0;
    let firstNonRegQuoteID = null;
    const [removedQuoteID, setRemovedQuoteID] = useState(null);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [dontHaveRegModal, setDontHaveRegModal] = useState(false);
    const [modalPhoneNumber, setModalPhoneNumber] = useState(null);
    const [showContNCarModal, setShowContNCarModal] = useState(false);
    const translator = useContext(TranslatorContext);
    const [selectedBrandName, setSelectedBrandName] = useState('');
    const offeredQuotesPath = 'quoteData.offeredQuotes.value';
    const chosenQuotePath = 'bindData.chosenQuote.value';
    const isAddAnotherCar = useSelector((state) => state.wizardState.app.isAddAnotherCar);


    // For checking hastings error
    const checkHastingsErrorHandler = (quote) => {
        const errorObject = checkHastingsError(quote);
        if (!errorObject.errorCode) {
            return false;
        }
        return true;
    };

    setNavigation({ canSkip: false, showForward: false });

    let noQuoteCars = 0;
    let quotedCars = 0;

    // For keeping count of cars with and without hastings error
    mcsubmissionVM.value.quotes.map((quote) => {
        if (checkHastingsErrorHandler(quote)) {
            noQuoteCars += 1;
        } else {
            quotedCars += 1;
        }
        if (!quote.lobData.privateCar.coverables.vehicles[0].registrationsNumber) {
            carsWithoutRegNum += 1;
            if (carsWithoutRegNum === 1) { firstNonRegQuoteID = quote.quoteID; }
        }
        return null;
    });

    // For calculating total multi car discount
    const getMultiCarDiscount = () => {
        return Math.abs(mcsubmissionVM.value.totalMPDiscount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    };

    useEffect(() => {
        resetCurrentPageIndex();
        setTotalDiscount(getMultiCarDiscount());
        dispatch(clearmultiQuoteData());
        dispatch(clearmultiToSingleQuoteData());
    }, []);

    // For displaying total discount at top right corner
    useEffect(() => {
        if (totalDiscount) {
            const data = {
                price: getAmountAsTwoDecimalDigit(totalDiscount),
                text: messages.totalMultiCarSaving,
                currency: '£'
            };
            EventEmmiter.dispatch('change', data);
        }
    }, [totalDiscount]);

    // useEffect after multiQuoteAPi gets called
    useEffect(() => {
        if (multiQuoteObject && multiQuoteObject.accountNumber) {
            _.set(mcsubmissionVM, 'value', multiQuoteObject);
            setTotalDiscount(getMultiCarDiscount());
            hideLoader();
        }
        if (multiQuoteError && _.get(multiQuoteError, 'error.message')) {
            hideLoader();
        }
        setRemovedQuoteID(null);
    }, [multiQuoteObject, multiQuoteError]);

    // useEffect after multiToSingle api gets called
    useEffect(() => {
        if (multiToSingleQuoteError && _.get(multiToSingleQuoteError, 'error.message')) {
            EventEmmiter.dispatch('change', { price: null });
            hideLoader();
        }
        if (multiToSingleQuoteObject && multiToSingleQuoteObject.quoteID) {
            if (multiCarFlag) {
                setNavigation({ multiCarFlag: false });
                _.set(mcsubmissionVM, 'value', mcsubmission);
                _.set(submissionVM, 'value', multiToSingleQuoteObject);
                dispatch(setNavigation({
                    quoteID: (multiToSingleQuoteObject && multiToSingleQuoteObject.quoteID) || '',
                    sessionUUID: (multiToSingleQuoteObject && multiToSingleQuoteObject.sessionUUID) || '',
                    isEditQuoteJourney: false
                }));
                dispatch(setVehicleDetails({}));
                // call reset multiToSingleQuoteObject ation
                // hideLoader();
            } else {
                EventEmmiter.dispatch('change', { price: null });
                hideLoader();
                dispatch(resetMultiToSingleObject());
                handleForward();
            }
        }
    }, [multiToSingleQuoteObject, multiToSingleQuoteError, multiCarFlag]);

    const getSingleSubmissionVM = () => {
        return mcsubmissionVM.quotes.children[0] || {};
    };

    useEffect(() => {
        if (isPCWJourney && isAddAnotherCar) {
            const submissionVMVal = getSingleSubmissionVM();
            const chosenQuoteID = _.get(submissionVMVal, chosenQuotePath) || '';
            const offeredQuotes = _.get(submissionVMVal, offeredQuotesPath) || [];
            const pcwJourneyChoosenQuote = offeredQuotes.find((offeredQuote) => offeredQuote.publicID === chosenQuoteID);
            if (pcwJourneyChoosenQuote) {
                setSelectedBrandName(pcwJourneyChoosenQuote.branchName);
            }
        }
    }, []);

    const removeCarHandler = (quoteID) => {
        setRemovedQuoteID(quoteID);
        setShowRemoveCarModal(true);
    };

    const dontHaveRegHandler = (phoneNumber) => {
        setModalPhoneNumber(phoneNumber);
        setDontHaveRegModal(true);
    };

    // For generating quote cards of cars without any hastings error
    const generateQuoteCards = () => {
        const carCards = [];
        for (let i = 0; i < mcsubmissionVM.quotes.children.length; i += 1) {
            if (!checkHastingsErrorHandler(mcsubmissionVM.quotes.children[i].value)) {
                carCards.push(
                    <HDSavingsPageCard
                        pageMetadata={pageMetadata}
                        key={mcsubmissionVM.quotes.children[i].value.quoteID}
                        carInfo={mcsubmissionVM.quotes.children[i]}
                        removeCarHandler={removeCarHandler}
                        dontHaveRegHandler={dontHaveRegHandler}
                        firstNonRegQuoteID={firstNonRegQuoteID}
                        isPCWJourney={isPCWJourney} />
                );
            }
        }
        return (
            <>
                {noQuoteCars > 0 ? <HDLabelRefactor Tag="h2" text={messages.dontWorryTitle} /> : null}
                {carCards}
            </>
        );
    };

    // For generating quote cards of cars with hastings error
    const generateNonQuoteCards = () => {
        const carCards = [];
        for (let i = 0; i < mcsubmissionVM.quotes.children.length; i += 1) {
            if (checkHastingsErrorHandler(mcsubmissionVM.quotes.children[i].value)) {
                carCards.push(
                    <HDSavingsPageCard
                        pageMetadata={pageMetadata}
                        key={mcsubmissionVM.quotes.children[i].value.quoteID}
                        carInfo={mcsubmissionVM.quotes.children[i]}
                        removeCarHandler={removeCarHandler}
                        dontHaveRegHandler={dontHaveRegHandler}
                        isPCWJourney={isPCWJourney} />
                );
            }
        }
        return (
            <>
                <HDLabelRefactor Tag="h2" text={messages.quoteUnavailableTitle} />
                {carCards}
            </>
        );
    };

    const getTopMessage = () => {
        if (quotedCars > 1) {
            return (
                <div className="text-md-center">
                    <HDLabelRefactor
                        Tag="span"
                        text={`${messages.topMessage1}£${getAmountAsTwoDecimalDigit(totalDiscount)}!*`}
                        className="savings-page__header" />
                    <HDLabelRefactor
                        Tag="p"
                        text={messages.savingsBasedOn}
                        className="savings-page__subheader" />
                </div>
            );
        }
        return null;
    };

    const checkParentCarReg = () => {
        let returnValue = true;
        for (let i = 0; i < mcsubmissionVM.value.quotes.length; i += 1) {
            if (mcsubmissionVM.value.quotes[i].isParentPolicy) {
                if (!mcsubmissionVM.value.quotes[i].lobData.privateCar.coverables.vehicles[0].registrationsNumber) {
                    returnValue = false;
                }
            }
        }
        return returnValue;
    };

    const getContinueNCarLabel = () => {
        if (carsWithoutRegNum && mcsubmissionVM.value.quotes.length - carsWithoutRegNum === 1) {
            return messages.continueOneCar;
        }
        if (carsWithoutRegNum && mcsubmissionVM.value.quotes.length - carsWithoutRegNum > 1) {
            return `${messages.continueOneCar.replace('one', getNumberAsString(mcsubmissionVM.value.quotes.length - carsWithoutRegNum))}s`;
        }
        return messages.continueOneCar;
    };

    const nCarContClicked = () => {
        if (!carsWithoutRegNum) {
            setShowContOneCarModal(true);
        } else {
            setShowContNCarModal(true);
        }
        dispatch(setNavigation({
            showHidePromotionalPage: true
        }));
    };

    const updateSelectVersionForMPAPITriggerPoint = (brandName) => {
        showLoader();
        const submissionVMVal = getSingleSubmissionVM();
        HDQuoteService.updateSelectedVersionForMP(getUpdateSelectedVersionForMPAPI(submissionVMVal, mcsubmissionVM, brandName))
            .then(({ result }) => {
                trackQuoteData(result, translator);
                trackAPICallSuccess('Update Selected Version For MP');
                setTotalDiscount(getAmountAsTwoDecimalDigitsOrWhole(result.totalMPDiscount));
                _.set(mcsubmissionVM, 'value', result);
                incrementCurrentPageIndex();
                hideLoader();
                handleForward();
            }).catch((error) => {
                trackAPICallFail('Update Selected Version For MP', 'Update Selected Version For MP Failed');
                hideLoader();
                // TODO: Business will confirm
                // setErrorStatusCode(error.status);
            });
    };

    const continueNextPage = () => {
        resetCurrentPageIndex();
        if (isAddAnotherCar) { updateSelectVersionForMPAPITriggerPoint(selectedBrandName); } else { handleForward(); }
    };

    // For getting continue buttons html
    const getContinueButtons = () => {
        return (
            <Row>
                <Col xs={12} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                    <HDButton
                        webAnalyticsEvent={{ event_action: messages.continueCoverSelection }}
                        id="continue-to-cover-selection-button"
                        className="w-100"
                        label={messages.continueCoverSelection}
                        variant="primary"
                        size="md"
                        onClick={continueNextPage}
                        disabled={carsWithoutRegNum} />
                </Col>
                {checkParentCarReg() && (
                    <Col xs={12} md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                        <HDButton
                            webAnalyticsEvent={{ event_action: getContinueNCarLabel() }}
                            id="continue-with-one-car-button"
                            className="w-100 margin-top-md"
                            label={getContinueNCarLabel()}
                            variant="secondary"
                            size="md"
                            onClick={nCarContClicked} />
                    </Col>
                )}
            </Row>
        );
    };

    const modalConfirmHandler = () => {
        if (showRemoveCarModal) {
            if (quotedCars === 2) {
                multiToSingleQuote(mcsubmissionVM);
            } else {
                multiQuote(mcsubmissionVM, removedQuoteID, false, translator);
            }
            setShowRemoveCarModal(false);
            showLoader();
        } else {
            multiToSingleQuote(mcsubmissionVM);
            setShowContOneCarModal(false);
            showLoader();
        }
        dispatch(setNavigation({
            showHidePromotionalPage: true
        }));
    };

    const modalCancelHandler = () => {
        if (showRemoveCarModal) {
            setRemovedQuoteID(null);
            setShowRemoveCarModal(false);
        } else {
            setShowContOneCarModal(false);
        }
    };

    const modalConfirmHandlerNCar = () => {
        showLoader();
        setShowContNCarModal(false);
        if (mcsubmissionVM.value.quotes.length - carsWithoutRegNum === 1) {
            multiToSingleQuote(mcsubmissionVM);
        } else { multiQuote(mcsubmissionVM, removedQuoteID, true, translator); }
        dispatch(setNavigation({
            showHidePromotionalPage: true
        }));
    };

    const getNoRegModalHeader = () => {
        if (!showedNoRegModal) { return messages.needReModalHeader; }
        return messages.noRegModalHeader;
    };

    const getNoRegModalContent = () => {
        if (!showedNoRegModal) {
            return <span>{messages.needRegModalContent}</span>;
        }
        return (
            <>
                <div className="mb-3 savings-page__no-reg-content">{messages.dontHaveRegModalContent1}</div>
                <div className="savings-page__no-reg-content">
                    {messages.dontHaveRegModalContent2}
                    <span className="font-bold">
                        {modalPhoneNumber}
                        &nbsp;
                    </span>
                    {messages.dontHaveRegModalContent3}
                </div>
            </>
        );
    };

    const noRegModalCancelHandler = () => {
        setNavigation({ showedNoRegModal: true });
        setDontHaveRegModal(false);
    };

    return (
        <Container className="savings-page-container px-md-5">
            <Row>
                <Col>
                    {getTopMessage()}
                    <div className="cars-container">
                        {noQuoteCars > 0 ? generateNonQuoteCards() : null}
                        {generateQuoteCards()}
                    </div>
                    <HDInfoCardRefactor
                        image={tipGreenIcon}
                        paragraphs={[messages.infoCardText1 + messages.infoCardText2]}
                        className="margin-bottom-lg"
                        size="thin" />
                    {getContinueButtons()}
                    <HDModal
                        id="savings-page-remove-car-modal"
                        webAnalyticsEvent={{ event_action: messages.removeCarModalContent }}
                        webAnalyticsView={{ ...pageMetadata, page_section: `${messages.areYouSure} - continue with one car` }}
                        customStyle={`${showRemoveCarModal ? ' rev-button-order' : ''}`}
                        show={showRemoveCarModal || showContOneCarModal}
                        headerText={messages.areYouSure}
                        cancelLabel={messages.noRemoveCar}
                        confirmLabel={showRemoveCarModal ? messages.yesRemoveCar : messages.yesContinue}
                        onCancel={modalCancelHandler}
                        onConfirm={modalConfirmHandler}
                        hideClose
                        confirmOnTop={showRemoveCarModal}
                    >
                        <span>
                            {showRemoveCarModal ? messages.removeCarModalContent : messages.contOneCarModalContent}
                        </span>
                    </HDModal>
                    <HDModal
                        id="savings-page-no-reg-modal"
                        webAnalyticsEvent={{ event_action: messages.dontHaveReg }}
                        webAnalyticsView={{ ...pageMetadata, page_section: getNoRegModalHeader() }}
                        show={dontHaveRegModal || (!showedNoRegModal && carsWithoutRegNum)}
                        headerText={getNoRegModalHeader()}
                        confirmLabel={messages.regModalBtnLabel}
                        onConfirm={noRegModalCancelHandler}
                        hideClose={!dontHaveRegModal}
                        hideCancelButton
                        hideConfirmButton={dontHaveRegModal}
                        onClose={() => setDontHaveRegModal(false)}
                    >
                        {getNoRegModalContent()}
                    </HDModal>
                    <HDModal
                        id="savings-page-remove-car-modal"
                        webAnalyticsEvent={{ event_action: messages.continueOneCar }}
                        webAnalyticsView={{ ...pageMetadata, page_section: `${messages.areYouSure} - continue with N car` }}
                        // eslint-disable-next-line max-len
                        customStyle={`${mcsubmissionVM.value.quotes.length - carsWithoutRegNum !== 1 ? ' rev-button-order' : ''}`}
                        show={showContNCarModal}
                        headerText={messages.areYouSure}
                        cancelLabel={messages.noRemoveCar}
                        confirmLabel={messages.yesContinue}
                        onCancel={() => setShowContNCarModal(false)}
                        onConfirm={modalConfirmHandlerNCar}
                        hideClose
                    >
                        <span>
                            {mcsubmissionVM.value.quotes.length - carsWithoutRegNum === 1 ? messages.contOneCarModalContent : messages.contNCarModalContent}
                        </span>
                    </HDModal>
                </Col>
            </Row>
            {HDFullscreenLoader}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        multiQuoteObject: state.multiQuoteModel.multiQuoteObj,
        multiQuoteError: state.multiQuoteModel.multiQuoteError,
        multiToSingleQuoteObject: state.multiToSingleQuoteModel.multiToSingleQuoteObj,
        multiToSingleQuoteError: state.multiToSingleQuoteModel.multiToSingleQuoteError,
        submissionVM: state.wizardState.data.submissionVM,
        multiCarFlag: state.wizardState.app.multiCarFlag,
        showedNoRegModal: state.wizardState.app.showedNoRegModal,
        isPCWJourney: state.wizardState.app.isPCWJourney,
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    multiQuote: multiQuoteAction,
    multiToSingleQuote: multiToSingleQuoteAction,
    setSubmissionVM: setSubmissionVMAction,
    resetCurrentPageIndex: resetCurrentPageIndexAction,
    clearmultiQuoteData,
    clearmultiToSingleQuoteData,
    resetMultiToSingleObject,
    incrementCurrentPageIndex: incrementCurrentPageIndexAction
};

HDSavingsPage.propTypes = {
    mcsubmissionVM: PropTypes.shape({ value: PropTypes.object, quotes: PropTypes.object }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    multiQuote: PropTypes.func.isRequired,
    multiQuoteObject: PropTypes.shape({
        accountHolder: PropTypes.shape({}),
        accountNumber: PropTypes.string,
        quotes: PropTypes.array,
        mpwrapperJobNumber: PropTypes.string,
        mpwrapperNumber: PropTypes.string,
        sessionUUID: PropTypes.string
    }),
    multiQuoteError: PropTypes.shape({}),
    multiToSingleQuote: PropTypes.func.isRequired,
    multiToSingleQuoteObject: PropTypes.shape({
        quoteID: PropTypes.string,
        sessionUUID: PropTypes.string
    }),
    multiToSingleQuoteError: PropTypes.shape({}),
    submissionVM: PropTypes.shape({
        value: PropTypes.shape({})
    }),
    handleForward: PropTypes.func.isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    showedNoRegModal: PropTypes.bool.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    resetCurrentPageIndex: PropTypes.func.isRequired,
    isPCWJourney: PropTypes.bool.isRequired,
    incrementCurrentPageIndex: PropTypes.func.isRequired,
};

HDSavingsPage.defaultProps = {
    multiQuoteObject: null,
    multiQuoteError: null,
    multiToSingleQuoteObject: null,
    multiToSingleQuoteError: null,
    submissionVM: null
};

export default connect(mapStateToProps, mapDispatchToProps)(HDSavingsPage);
