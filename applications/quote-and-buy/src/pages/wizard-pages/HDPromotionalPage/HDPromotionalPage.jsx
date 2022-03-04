/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
    useEffect, useState, useContext, useMemo
} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect, useSelector } from 'react-redux';
// Hastings
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
    HDForm, HDLabelRefactor, HDInfoCardRefactor
} from 'hastings-components';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { useCookies } from 'react-cookie';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDTextInput as HDTextInput
} from '../../../web-analytics';
import {
    setNavigation as setNavigationAction,
    setVehicleDetails as setVehicleDetailsAction, setSubmissionVM as setSubmissionVMAction,
    setMultiCarSubmissionVM as setMultiCarSubmissionVMAction,
    clearLWRQuoteData as clearLWRQuoteDataAction,
    setErrorStatusCode as setErrorStatusCodeAction,
    clearCreatedSubmission as clearCreatedSubmissionAction,
    clearUpdateQuoteData as clearUpdateQuoteDataAction,
    clearUpdateMultiQuoteData as clearUpdateMultiQuoteDataAction
} from '../../../redux-thunk/actions';
import HDQuoteService from '../../../api/HDQuoteService';
import * as messages from './HDPromotionalPage.messages';
import { HastingsVehicleInfoLookupService } from '../../../../../../common/capabilities/hastings-capability-vehicleinfolookup';
import HDSearchVehiclePage from '../../HDSearchVehiclePage/HDSearchVehiclePage';
import CircleExclamation from '../../../assets/images/icons/circle-exclamation.svg';
import { WIZARD_INITIAL_ROUTE } from '../../../routes/BaseRouter/RouteConst';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import submission from '../../../routes/SubmissionVMInitial';
import { fetchSavingsPromotional } from '../../../common/downloadFile/helpers';
import customSubmission from '../__helpers__/customizeSubmissionVMInitial';
import { removeDataBasedOnPeriodStatus, removeOfferings } from '../../../common/submissionMappers/helpers';
import * as monetateHelper from '../../../common/monetateHelper';
import {
    UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE, QUOTE_DECLINE_ERROR_CODE
} from '../../../constant/const';
import { getMultiToSingleParam } from '../../../common/utils';
import mcsubmission from '../../../routes/MCSubmissionVMInitial';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';

export const HDPromotionalPage = (props) => {
    const {
        submissionVM, setNavigation, offeredQuoteObject, setVehicleDetails, pageMetadata, handleForward,
        mcsubmissionVM, setMultiCarSubmissionVM, clearLWRQuoteData, customizeSubmissionVM, setErrorStatusCode, clearCreatedSubmission,
        clearUpdateQuoteData, clearUpdateMultiQuoteData
    } = props;
    const pageID = 'HDPromotionalPage';
    const offeredQuotesPath = 'quoteData.offeredQuotes';
    const [resetVRN, setVrn] = useState(false);
    const [invalidEntry, setInvalidEntry] = useState(false);
    const [isBikeReg, setIsBikeReg] = useState(false);
    const [isVanReg, setIsVanReg] = useState(false);
    const [invalidEntryMessage, setInvalidEntryMessage] = useState(messages.invalidRegNumber);
    const [quoteVal, setQuoteVal] = useState(0);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const viewModelService = useContext(ViewModelServiceContext);
    const [greetingText, setGreetingText] = useState('');
    const [isDuplicateCar, setDuplicateCar] = useState(false);
    const [multicarsubmissionVMCreated, setmulticarSubmissionVMCreated] = useState(false);
    const [promoSavings, setPromoSavings] = useState('');
    const [eachCarMsg, setEachCarMsg] = useState('');
    const [savingValNa, setSavingValNa] = useState('');
    const [lastNote, setLastNote] = useState('');
    const multiCarElements = useSelector((state) => state.monetateModel.resultData);
    const retrievedCookie = useSelector((state) => state.monetateModel.monetateId);
    const pcwName = useSelector((state) => state.wizardState.app.pcwName);
    const multiCarFlag = useSelector((state) => state.wizardState.app.multiCarFlag);
    const [cookies, setCookie] = useCookies(['']);
    const [savingsNotAvail, setSavingsNotAvail] = useState(false);
    const cloneViewModel = (viewModel) => _.cloneDeep(viewModel);
    let indicativeDiscount;
    if (viewModelService) {
        if (!multicarsubmissionVMCreated && _.get(mcsubmissionVM, 'value.accountNumber') === undefined) {
            setMultiCarSubmissionVM({
                mcsubmissionVM: viewModelService.create(
                    {},
                    'pc',
                    'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
                ),
            });
            setmulticarSubmissionVMCreated(true);
        }
    }

    useEffect(() => {
        let tempArray = []; let filteredArray = []; let nonFilteredArray = [];
        const seenParam = monetateHelper.getSeenParam(multiCarElements);
        let producerCodeArray = monetateHelper.fetchCookieByName('mc.producerCode') && monetateHelper.fetchCookieByName('mc.producerCode');
        if (!producerCodeArray.includes(pcwName)) {
            tempArray = cookies && cookies['mc.v'] && cookies['mc.v'].producerCodeSeenParamArray ? cookies['mc.v'].producerCodeSeenParamArray : [];
            producerCodeArray = producerCodeArray.concat(producerCodeArray.length && cookies['mc.producerCode'] ? `${`,${pcwName}`}` : `${pcwName}`);
            setCookie('mc.producerCode', producerCodeArray, {
                path: '/'
            });
            tempArray.push({ producerCode: pcwName, seenMulticar: seenParam === undefined ? 'None' : seenParam.toString() });
        } else {
            filteredArray = cookies && cookies['mc.v'] && cookies['mc.v'].producerCodeSeenParamArray && cookies['mc.v'].producerCodeSeenParamArray.filter((element) => element.producerCode === pcwName);
            nonFilteredArray = cookies && cookies['mc.v'] && cookies['mc.v'].producerCodeSeenParamArray && cookies['mc.v'].producerCodeSeenParamArray.filter((element) => element.producerCode !== pcwName);
            if (filteredArray && filteredArray.length) {
                filteredArray[0].producerCode = pcwName;
                filteredArray[0].seenMulticar = (seenParam === undefined) ? 'None' : seenParam.toString();
            }
            tempArray = [...nonFilteredArray, ...filteredArray];
        }
        const pcSeenObj = {
            producerCodeSeenParamArray: tempArray
        };
        const val = { monetateId: cookies['mt.v'] ? cookies['mt.v'] : retrievedCookie, seenParam: seenParam && seenParam.toString(), ...pcSeenObj };
        const obj = JSON.stringify(val);
        setCookie('mc.v', obj, {
            path: '/'
        });
        if (!cookies['mt.v'] && retrievedCookie) {
            setCookie('mt.v', retrievedCookie, {
                path: '/'
            });
        }
    }, [multiCarElements]);

    const getDiscountFromofferedQuoteObject = () => {
        if (offeredQuoteObject && offeredQuoteObject.offeredQuotes[0]) {
            if (offeredQuoteObject.offeredQuotes[0].mpindicativePNCDDisc) {
                return offeredQuoteObject.offeredQuotes[0].mpindicativePNCDDisc.amount;
            } if (offeredQuoteObject.offeredQuotes[0].mpindicativeNCDDisc) {
                return offeredQuoteObject.offeredQuotes[0].mpindicativeNCDDisc.amount;
            }
        }
        return '';
    };

    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        setNavigation({
            canSkip: false,
            canForward: false,
            showForward: false,
            isEditQuoteJourney: false
        });
        const firstName = _.get(submissionVM, 'value.baseData.accountHolder.firstName') || _.get(mcsubmissionVM, 'value.accountHolder.firstName');
        if (firstName) {
            setGreetingText(`${messages.greetingText} ${firstName}!`);
            // greetingText = `${messages.greetingText} ${firstName}!`;
        }
        const getAvailableQuotes = () => {
            const errorCodes = [UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE, QUOTE_DECLINE_ERROR_CODE];
            let offerQuotes = _.get(submissionVM, offeredQuotesPath) || [];
            offerQuotes = offerQuotes.value || [];
            return offerQuotes.filter((offeredQuote) => (!(offeredQuote.hastingsErrors
                && offeredQuote.hastingsErrors.some(({ technicalErrorCode }) => errorCodes.indexOf(technicalErrorCode) > -1))));
        };

        const filteredOfferedQuotes = getAvailableQuotes().filter((offeredQuotesObj) => {
            return offeredQuotesObj.branchCode === offeredQuoteObject.offeredQuotes[0].branchCode;
        });

        const isNCDSelected = _.get(submissionVM, 'value.lobData.privateCar.coverables.vehicles[0].ncdProtection.drivingExperience.protectNCD');
        if (isNCDSelected) {
            indicativeDiscount = 'mpindicativePNCDDisc';
        } else {
            indicativeDiscount = 'mpindicativeNCDDisc';
        }

        const promotionalDiscount = filteredOfferedQuotes[0] ? filteredOfferedQuotes[0][indicativeDiscount].amount : getDiscountFromofferedQuoteObject();

        if (promotionalDiscount) {
            setPromoSavings(promotionalDiscount.toFixed(2));
        } else {
            setSavingsNotAvail(true);
            setPromoSavings(messages.savingNotAvailableFirst);
            setSavingValNa(messages.savingNotAvailableValue);
            setEachCarMsg(messages.savingNotAvailableSecond);
            setLastNote(messages.savingNotAvailableThird);
        }
    }, []);

    useEffect(() => {
        const quotValue = _.get(offeredQuoteObject, 'offeredQuotes');
        if (quotValue && quotValue.length) {
            setQuoteVal(quotValue[0] && quotValue[0].hastingsPremium
                && quotValue[0].hastingsPremium.annuallyPayment.premiumAnnualCost.amount
                ? quotValue[0].hastingsPremium.annuallyPayment.premiumAnnualCost.amount : 0);
        }
    }, [submissionVM]);


    const handleValidation = (isValid) => {
        setNavigation({ canForward: isValid });
    };

    const registrationNumber = _.get(submissionVM, 'value.lobData.privateCar.coverables.vehicles[0].registrationsNumber', 'XYZ');

    const regNumber = 'registrationNumber';
    const validationSchema = yup.object({
        [regNumber]: yup.string(),

    });

    const registrationReqVM = useMemo(() => {
        let dd;
        if (viewModelService) {
            dd = viewModelService.create({}, 'pc', 'com.hastings.edgev10.capabilities.vehicleinfo.dto.request.RegistrationReqDTO');
        }
        return dd;
    }, []);
    const registrationPath = registrationReqVM && registrationReqVM.registrationNumber ? registrationReqVM.registrationNumber : '';

    const handleChange = (event) => {
        const inputValue = event.target.value;
        if (registrationNumber === inputValue.toUpperCase().replace(/\s+/g, '')) {
            setDuplicateCar(true);
            setVrn(false);
            setInvalidEntry(true);
            setInvalidEntryMessage(messages.duplicateCar);
            setIsBikeReg(false);
            setIsVanReg(false);
            return true;
            // eslint-disable-next-line no-else-return
        } else if (inputValue.indexOf('-') > 0 || inputValue.indexOf("'") > 0 || inputValue.search("'") !== -1 || inputValue.search('-') !== -1) {
            setInvalidEntryMessage(messages.specialCharRegNo);
            setInvalidEntry(true);
            setIsBikeReg(false);
            setIsVanReg(false);
            setDuplicateCar(false);
            setVrn(false);
        } else {
            setDuplicateCar(false);
            setVrn(false);
            setInvalidEntry(false);
            setIsBikeReg(false);
            setIsVanReg(false);
            return false;
        }
        return false;
    };

    const loadVehicleDetails = (regNo, vehicleInfo) => {
        // eslint-disable-next-line no-param-reassign
        vehicleInfo.result.regNo = regNo;
        setVehicleDetails({ data: vehicleInfo.result });
        _.set(submissionVM, 'value', cloneViewModel(submission));
        hideLoader();
        // eslint-disable-next-line react/prop-types
        props.history.push({
            pathname: WIZARD_INITIAL_ROUTE,
            state: { fromPage: messages.pageText, waMultiFlag: true }
        });
    };

    const loadVehicleDetailsWithoutVRN = (vehicleData) => {
        _.set(submissionVM, 'value', cloneViewModel(submission));
        setVehicleDetails({ data: vehicleData });
        hideLoader();
        props.history.push({
            pathname: WIZARD_INITIAL_ROUTE,
            state: { fromPage: messages.pageText, waMultiFlag: true }
        });
    };

    const getDataforSingleToMulti = () => {
        const dataObject = _.cloneDeep(submissionVM.value);
        removeDataBasedOnPeriodStatus(dataObject, ['Quoted', 'Draft']);
        removeOfferings(dataObject);
        return dataObject;
    };

    const singleToMultiHandler = (isVRNProvided, regNoOrVehicleData, vehicleInfo) => {
        HDQuoteService.singleToMultiProduct(getDataforSingleToMulti())
            .then(({ result }) => {
                hideLoader();
                _.set(mcsubmissionVM, 'value', result);
                setNavigation({ multiCarFlag: true, hideGoBack: false });
                clearLWRQuoteData();
                const isCustomSubVMCreated = _.get(customizeSubmissionVM, 'value', false);
                const isCustomSubVMHasID = _.get(customizeSubmissionVM, 'value.quoteID', false);
                if (isCustomSubVMCreated && isCustomSubVMHasID) {
                    _.set(customizeSubmissionVM, 'value', cloneViewModel(customSubmission));
                }
                clearCreatedSubmission();
                clearUpdateQuoteData();
                clearUpdateMultiQuoteData();
                if (isVRNProvided) {
                    loadVehicleDetails(regNoOrVehicleData, vehicleInfo);
                } else {
                    loadVehicleDetailsWithoutVRN(regNoOrVehicleData);
                }
                setNavigation({
                    isAddAnotherCar: true
                });
            }).catch((error) => {
                hideLoader();
                setErrorStatusCode(error.status);
            });
    };

    const getVRN = () => {
        let regNo = registrationPath.value ? registrationPath.value.toUpperCase() : '';
        if (registrationPath.value) {
            regNo = (registrationPath.value.toUpperCase()).replace(/\s+/g, '');
            _.set(registrationPath, 'value', regNo);
        }
        if (!regNo || regNo === '') {
            setInvalidEntryMessage(messages.invalidInput);
            setInvalidEntry(true);
            return;
        }
        if (regNo.indexOf('-') > 0 || regNo.indexOf("'") > 0 || regNo.search("'") !== -1 || regNo.search('-') !== -1) {
            setInvalidEntryMessage(messages.specialCharRegNo);
            setInvalidEntry(true);
            return;
        }
        if (isDuplicateCar) {
            return;
        }
        const dataObject = [{ registrationNumber: regNo }];
        showLoader();

        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN(dataObject)
            .then((vehicleInfo) => {
                if ((!vehicleInfo.result && !vehicleInfo.result.abiCode) || vehicleInfo.result.type === undefined) {
                    setInvalidEntryMessage(messages.invalidRegNo);
                    setVrn(true);
                    setInvalidEntry(true);
                    hideLoader();
                } else if (vehicleInfo.result.type === messages.motorcycleExt) {
                    setInvalidEntryMessage(messages.bikeReg);
                    setInvalidEntry(true);
                    setIsBikeReg(true);
                    hideLoader();
                } else if (!multiCarFlag) {
                    // Data retrieved without any errors
                    singleToMultiHandler(true, regNo, vehicleInfo);
                    // loadVehicleDetails(regNo, vehicleInfo);
                } else {
                    loadVehicleDetails(regNo, vehicleInfo);
                }
            })
            .catch(() => {
                hideLoader();
                setInvalidEntryMessage(messages.invalidRegNo);
                setInvalidEntry(true);
            });
        setNavigation({
            showHidePromotionalPage: true
        });
    };

    const handleLookUp = (vehicleData) => {
        if (!multiCarFlag) {
            showLoader();
            singleToMultiHandler(false, vehicleData);
        } else {
            loadVehicleDetailsWithoutVRN(vehicleData);
        }
        setNavigation({
            showHidePromotionalPage: true
        });
    };

    const multiToSingleHandler = () => {
        showLoader();
        const mcVM = getMultiToSingleParam(mcsubmissionVM);
        // We need to forcefully quote the SC request. Current request is in draft status
        _.set(mcVM, 'quotes[0].baseData.periodStatus', 'Quoted');
        HDQuoteService.multiToSingleQuote(mcVM)
            .then(({ result }) => {
                _.set(submissionVM, 'value', result);
                setNavigation({ quoteID: result.quoteID, sessionUUID: result.sessionUUID, multiCarFlag: false });
                _.set(mcsubmissionVM, 'value', _.cloneDeep(mcsubmission));
                setVehicleDetails({});
                hideLoader();
                handleForward();
                trackAPICallSuccess(messages.multiToSingle);
            }).catch((errorMessage) => {
                hideLoader();
                handleForward();
                setErrorStatusCode(errorMessage.status);
                trackAPICallFail(messages.multiToSingle, messages.multiToSingleFailed);
            });
    };

    const continueOneCarHandleForward = () => {
        setNavigation({
            showHidePromotionalPage: true
        });
        if (multiCarFlag) {
            multiToSingleHandler();
        } else {
            handleForward();
        }
    };

    return (
        <Container className="mc-promo-page-container">
            <Row>
                <Col>
                    <HDLabelRefactor
                        Tag="h1"
                        className="mc-promo-page__welcome-header"
                        text={greetingText} />
                    <HDLabelRefactor
                        Tag="span"
                        className="mc-promo-page__main-header"
                        text={(
                            <>
                                {messages.promotext1}
                                <b>{` £${quoteVal.toFixed(2)}`}</b>
                                {savingsNotAvail ? '' : messages.promotext2}
                                {savingsNotAvail
                                    // eslint-disable-next-line react/jsx-wrap-multilines
                                    ? <div className="mc-promo-page__last-note-div">
                                        <span>{promoSavings}</span>
                                        <b>{savingValNa}</b>
                                      </div>
                                    : <b>{` £${(promoSavings)}`}</b>}
                                {savingsNotAvail ? eachCarMsg : messages.promotext3}
                            </>
                        )} />
                    {savingsNotAvail
                        ? (
                            <HDLabelRefactor
                                Tag="span"
                                className="mc-promo-page__last-note-span"
                                text={lastNote} />
                        ) : ''}
                    <HDInfoCardRefactor
                        id="mc-promo-page-additional-info-card"
                        className="margin-top-md"
                        image={CircleExclamation}
                        paragraphs={[(
                            <ul className="pad-inl-start-beg m-0">
                                {messages.additionalinformationList.map((el, i) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <li key={i}><span className="pad-inl-start-bullets">{el}</span></li>
                                ))}
                            </ul>
                        )]} />
                    <HDForm
                        submissionVM={registrationReqVM}
                        validationSchema={validationSchema}
                        onValidation={handleValidation}
                    >
                        <Row>
                            <Col xs={12} md={8} lg={5}>
                                <HDTextInput
                                    webAnalyticsEvent={{ event_action: messages.findMakeModelBtnText, event_value: messages.inputPlaceholder }}
                                    className="input-licence-plate margin-top-lg"
                                    id="mc-promo-page-vrn-search-input"
                                    path={regNumber}
                                    name={regNumber}
                                    maxLength="8"
                                    preText="GB"
                                    reset={resetVRN}
                                    type="alphanum"
                                    onChange={(e) => handleChange(e)}
                                    placeholder={messages.inputPlaceholder}
                                    isInvalidCustom={invalidEntry} />
                            </Col>
                        </Row>
                    </HDForm>
                    {invalidEntry && (
                        <div className="invalid-field mt-0">
                            <div className="message">
                                {invalidEntryMessage}
                            </div>
                        </div>
                    )}
                    {registrationNumber && (
                        <HDSearchVehiclePage
                            pageMetadata={pageMetadata}
                            onConfirm={handleLookUp}
                            trigger={(
                                <a id="mc-promo-page-make-model-link" className="decorated-blue-line" parent={pageID}>
                                    {messages.dontHaveLink}
                                </a>
                            )}
                            {...props} />
                    )}
                    <Row>
                        <Col xs={12} md={6} lg={5} xl={4}>
                            <HDButton
                                webAnalyticsEvent={{ event_action: `${messages.promotion} - ${messages.findCarBtnText}` }}
                                id="mc-promo-page-find-car-btn"
                                onClick={getVRN}
                                label={messages.findCarBtnText}
                                variant="primary"
                                size="md"
                                className="w-100 margin-top-lg" />
                            <HDButton
                                webAnalyticsEvent={{ event_action: `${messages.promotion} - ${messages.continueOneCar}` }}
                                id="mc-promo-page-continue-one-car-btn"
                                onClick={continueOneCarHandleForward}
                                className="btn-block margin-top-lg"
                                label={messages.continueOneCar}
                                variant="secondary"
                                size="md" />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {HDFullscreenLoader}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        offeredQuoteObject: state.offeredQuoteModel,
        vehicleDetails: state.vehicleDetails,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setNavigation: (data) => dispatch(setNavigationAction(data)),
        setVehicleDetails: (data) => dispatch(setVehicleDetailsAction(data)),
        setSubmissionVM: (data) => dispatch(setSubmissionVMAction(data)),
        setMultiCarSubmissionVM: (data) => dispatch(setMultiCarSubmissionVMAction(data)),
        clearLWRQuoteData: () => dispatch(clearLWRQuoteDataAction()),
        setErrorStatusCode: (data) => dispatch(setErrorStatusCodeAction(data)),
        clearCreatedSubmission: () => dispatch(clearCreatedSubmissionAction()),
        clearUpdateQuoteData: () => dispatch(clearUpdateQuoteDataAction()),
        clearUpdateMultiQuoteData: () => dispatch(clearUpdateMultiQuoteDataAction())
    };
};

HDPromotionalPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired, value: PropTypes.object }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    offeredQuoteObject: PropTypes.shape({ offeredQuotes: PropTypes.array }).isRequired,
    setVehicleDetails: PropTypes.func.isRequired,
    setSubmissionVM: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    handleForward: PropTypes.func.isRequired,
    history: PropTypes.shape({ location: PropTypes.object, push: PropTypes.func }).isRequired,
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.object
    }),
    setMultiCarSubmissionVM: PropTypes.func.isRequired,
    clearLWRQuoteData: PropTypes.func.isRequired,
    setErrorStatusCode: PropTypes.func.isRequired,
    customizeSubmissionVM: PropTypes.shape({
        value: PropTypes.shape({})
    }),
    clearCreatedSubmission: PropTypes.func.isRequired,
    clearUpdateQuoteData: PropTypes.func.isRequired,
    clearUpdateMultiQuoteData: PropTypes.func.isRequired
};

HDPromotionalPage.defaultProps = {
    mcsubmissionVM: {},
    customizeSubmissionVM: null
};

export default connect(mapStateToProps, mapDispatchToProps)(HDPromotionalPage);
