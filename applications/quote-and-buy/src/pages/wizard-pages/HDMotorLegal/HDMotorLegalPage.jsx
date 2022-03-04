/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';
import {
    HDLabelRefactor,
    HDQuoteInfoRefactor,
    HDQuoteDownloadRefactor,
    HDInfoCardRefactor
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup
} from '../../../web-analytics';
import EventEmmiter from '../../../EventHandler/event';
import {
    updateQuoteCoverages, updateAncillaryJourney, getIpidDocumnet, setNavigation
} from '../../../redux-thunk/actions';
import BlueTick from '../../../assets/images/icons/blue-tick-icon.svg';
import motorLegalIcon from '../../../assets/images/wizard-images/hastings-icons/icons/legal.svg';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import * as messages from './HDMotorLegalPage.messages';
import useToast from '../../Controls/Toast/useToast';
import ConnectedHDManualUpgradeDowngrade from '../HDManualUpgradeDowngrade/HDManualUpgradeDowngrade';
import {
    generateDownloadableLink,
    getAmount,
    iPidAncillaryAPIObject,
    isSafariAndiOS
} from '../../../common/utils';
import { MOTOR_LEGAL, defaqtoSrc } from '../../../constant/const';
import { getPCWName } from './HastingsPCWHelper';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';

import { producerCodeList } from '../../../common/producerCodeHelper';

const HDMotorLegalPage = (props) => {
    const {
        customizeSubmissionVM, updateQuoteCoveragesData, dispatch, location, ancillaryJourneyDataModel, showManualDowngrade,
        setShowManualDowngrade, onUpgradeDowngradeCancellation, onUpgrade,
        onDowngrade, onGoBack, displayPNCDPage, pageMetadata, actionType
    } = props;

    const ancSelectionState = useSelector((state) => state.ancillaryJourneyModel.motorLegal);
    const canShowContinue = useSelector((state) => state.wizardState.app.showContinueOnML);
    const [motorLegalPage, setMotorLegalPage] = useState(null);
    const [includeExpensesCover, setIncludeExpensesCover] = useState(null);
    const [motorLegalExpense, setMotorLegalExpense] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);
    const [motorLegalCoverExpense, setMotorLegalCoverExpense] = useState(null);
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const [monthlyAmountVal, setMonthlyAmount] = useState(0);
    const [HDToast, addToast] = useToast();
    const annualAmountPath = 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount';
    const monthlyAmountPath = 'quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount';
    const branchCodePath = 'quote.branchCode';
    const monthlyPaymentObjectPath = 'value.quote.hastingsPremium.monthlyPayment';
    const [oneTimeSelectedValue, setOneTimeSelectedValue] = useState(null);
    const isInsurancePaymentType = _.get(customizeSubmissionVM, 'value.insurancePaymentType');
    const [loading, setLoading] = useState(false);
    const [preSelectedValue, setPreselectedValue] = useState(true);
    const isMotorLegalChosen = useSelector((state) => state.wizardState.app.pcwLegalChosen);
    const availableValues = [{
        value: 'yes',
        name: messages.yes,
    }, {
        value: 'no',
        name: messages.no,
    }];

    const setSelectedMotorLegal = (coverStr) => {
        if (customizeSubmissionVM) {
            customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data) => {
                data.coverages.map((nestedData) => {
                    if (nestedData.publicID === messages.ANCMotorLegalExpensesCovExt) {
                        if (nestedData.selected && oneTimeSelectedValue === null) {
                            dispatch(setNavigation(
                                { showContinueOnML: true }
                            ));
                            dispatch(updateAncillaryJourney(MOTOR_LEGAL));
                        }
                        if (messages.SMALL_PCW === coverStr) {
                            if (nestedData.selected) {
                                setMotorLegalExpense(messages.smallYes);
                                setOneTimeSelectedValue(messages.smallYes);
                                setIncludeExpensesCover(null);
                                dispatch(setNavigation(
                                    { showContinueOnML: ancillaryJourneyDataModel.motorLegal }
                                ));
                            }
                            if (ancillaryJourneyDataModel.motorLegal) {
                                setMotorLegalExpense(nestedData.selected ? messages.smallYes : messages.smallNo);
                                setOneTimeSelectedValue(messages.smallYes);
                                setIncludeExpensesCover(null);
                            }
                        } else if (messages.HD === coverStr && nestedData.selected) {
                            setMotorLegalExpense(messages.smallYes);
                            setOneTimeSelectedValue(messages.smallYes);
                        } else if (messages.HD === coverStr && !nestedData.selected) {
                            if (ancillaryJourneyDataModel.motorLegal) {
                                setMotorLegalExpense(nestedData.selected ? messages.smallYes : messages.smallNo);
                            } else {
                                setMotorLegalExpense(null);
                            }
                        }
                    }
                    return null;
                });
                return null;
            });
        }
    };

    const updateMonthlyAnnualPrice = () => {
        const isMonthlyPaymentAvailable = _.get(customizeSubmissionVM, monthlyPaymentObjectPath, false);
        const paymentType = (isMonthlyPaymentAvailable && isInsurancePaymentType === messages.PAYMENT_TYPE_MONTHLY_CODE)
            ? messages.PAYMENT_TYPE_MONTHLY_CODE : messages.PAYMENT_TYPE_ANNUALLY_CODE;
        const annualAmount = _.get(customizeSubmissionVM, `${annualAmountPath}.value`);
        const monthlyAmount = _.get(customizeSubmissionVM, `${monthlyAmountPath}.value`);
        setMonthlyAmount(monthlyAmount);
        EventEmmiter.dispatch('change', getAmount(paymentType, annualAmount, monthlyAmount));
    };

    useEffect(() => {
        const { producerCode } = customizeSubmissionVM;
        if (_.get(customizeSubmissionVM, `${branchCodePath}.value`) === messages.HP) {
            setMotorLegalPage(messages.SMALL_HP);
            dispatch(updateAncillaryJourney(MOTOR_LEGAL));
        } else if ((location && location.state && location.state.PCWJourney)
        || (producerCode && producerCode.value !== 'Default' && (actionType !== messages.directText && !_.includes(producerCodeList, producerCode.value))
        && producerCode.value !== 'ClearScore')) {
            setMotorLegalPage(messages.SMALL_PCW);
            setSelectedMotorLegal(messages.SMALL_PCW);
        } else {
            setMotorLegalPage(null);
            setSelectedMotorLegal(messages.HD);
        }
        customizeSubmissionVM && customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data) => {
            data.coverages.map((nestedData) => {
                if (nestedData.publicID === messages.ANCMotorLegalExpensesCovExt) {
                    setMotorLegalCoverExpense(nestedData.amount.amount);
                }
                return null;
            });
            return null;
        });
        updateMonthlyAnnualPrice();
    }, [customizeSubmissionVM.quote.branchCode.value, location]);

    // to handle the ipid doc api
    useEffect(() => {
        const ipiddFailureObj = _.get(ancillaryJourneyDataModel, 'ipidDocError.error');
        if (ipiddFailureObj) {
            // TODO: error handeling for ipid match for all api call
        }
    }, [ancillaryJourneyDataModel]);

    useEffect(() => {
        if (includeExpensesCover != null) {
            setIncludeExpensesCover(null);
            if (ancSelectionState || motorLegalPage === messages.SMALL_PCW) {
                props.navigate(true); // pass false to go back
            }
        }
    }, [props, includeExpensesCover]);


    useEffect(() => {
        !showManualDowngrade && props.toggleContinueElement(false); // pass false to explicitly make parent continue button invisible
    }, [props]);

    useEffect(() => {
        setShowManualDowngrade(false);
    }, []);

    useEffect(() => {
        if (customizeSubmissionVM
            && updateQuoteCoveragesData
            && (_.get(updateQuoteCoveragesData, 'quoteCoveragesObj')
                && Object.keys(updateQuoteCoveragesData.quoteCoveragesObj).length > 0)
            && aPITriggerPoint) {
            setLoading(false);
            _.set(customizeSubmissionVM.value, 'quote', updateQuoteCoveragesData.quoteCoveragesObj.quote);
            _.set(customizeSubmissionVM.value, 'quoteID', updateQuoteCoveragesData.quoteCoveragesObj.quoteID);
            _.set(customizeSubmissionVM.value, 'sessionUUID', updateQuoteCoveragesData.quoteCoveragesObj.sessionUUID);
            _.set(customizeSubmissionVM.value, 'periodStartDate', updateQuoteCoveragesData.quoteCoveragesObj.periodStartDate);
            _.set(customizeSubmissionVM.value, 'periodEndDate', updateQuoteCoveragesData.quoteCoveragesObj.periodEndDate);
            _.set(customizeSubmissionVM.value, 'coverType', updateQuoteCoveragesData.quoteCoveragesObj.coverType);
            _.set(customizeSubmissionVM.value, 'voluntaryExcess', updateQuoteCoveragesData.quoteCoveragesObj.voluntaryExcess);
            _.set(customizeSubmissionVM.value, 'ncdgrantedYears', updateQuoteCoveragesData.quoteCoveragesObj.ncdgrantedYears);
            _.set(customizeSubmissionVM.value, 'ncdgrantedProtectionInd', updateQuoteCoveragesData.quoteCoveragesObj.ncdgrantedProtectionInd);
            _.set(customizeSubmissionVM.value, 'ncdProtectionAdditionalAmount', updateQuoteCoveragesData.quoteCoveragesObj.coverables
                ? updateQuoteCoveragesData.quoteCoveragesObj.coverables.vehicles[0].ncdProtection.ncdProtectionAdditionalAmount : 0);
            _.set(customizeSubmissionVM.value, 'producerCode', updateQuoteCoveragesData.quoteCoveragesObj.producerCode);
            _.set(customizeSubmissionVM.value, 'insurancePaymentType', updateQuoteCoveragesData.quoteCoveragesObj.insurancePaymentType);
            _.set(customizeSubmissionVM.value, 'otherOfferedQuotes', updateQuoteCoveragesData.quoteCoveragesObj.otherQuotes);
            _.set(customizeSubmissionVM.value, 'coverages', updateQuoteCoveragesData.quoteCoveragesObj.coverages);
            setAPITriggerPoint(false);
            setIncludeExpensesCover(true);
            const isSelected = selectedValue === 'true' || selectedValue === 'yes';
            addToast(
                {
                    id: 'motor-legal-toast',
                    webAnalyticsEvent: {
                        event_action: `${messages.ancillaries} - ${messages.summary}`,
                        event_value: `${isSelected ? messages.add : messages.remove} ${messages.pageTitle}`
                    },
                    webAnalyticsView: {
                        ...pageMetadata,
                        page_section: `${messages.ancillaries} - ${messages.summary} - ${isSelected
                            ? messages.add
                            : messages.remove} ${messages.pageTitle}`
                    },
                    iconType: isSelected ? 'tick' : 'cross',
                    bgColor: 'main',
                    content: isSelected
                        ? messages.popupMessage(motorLegalCoverExpense || '19.99') : messages.removedPopupMessage
                }
            );

            dispatch(updateAncillaryJourney(MOTOR_LEGAL));
        }

        if (updateQuoteCoveragesData && updateQuoteCoveragesData.quoteCoveragesError) {
            setLoading(false);
            setAPITriggerPoint(false);
            setIncludeExpensesCover(null);
        }

        updateMonthlyAnnualPrice();
    }, [updateQuoteCoveragesData, customizeSubmissionVM]);


    const mainColPropsManuUpgrDowngr = {
        xs: { span: 12, offset: 0 }
    };

    const handleDowngradeGoBack = () => {
        setShowManualDowngrade(false);
        onUpgradeDowngradeCancellation();
    };
    const handleBack = () => {
        if (ancillaryJourneyDataModel) {
            dispatch(setNavigation({
                showContinueOnML: ancillaryJourneyDataModel.motorLegal,
                showContinueOnPAC: ancillaryJourneyDataModel.personalAccident,
                showContinueOnSV: ancillaryJourneyDataModel.substituteVehicle,
                showContinueOnRAC: ancillaryJourneyDataModel.breakdown
            }));
        }
        onGoBack();
    };

    if (showManualDowngrade) {
        return (

            <Row>
                <Col {...mainColPropsManuUpgrDowngr}>
                    <ConnectedHDManualUpgradeDowngrade
                        isMonthlyPaymentAvailable={!!monthlyAmountVal}
                        isUpgrade={false}
                        onGoBack={handleDowngradeGoBack}
                        onDowngrade={onDowngrade}
                        onUpgrade={onUpgrade} />

                </Col>
            </Row>
        );
    }

    const callUpdateQuoteCoverages = (targetValue, apiCallFlag) => {
        if (customizeSubmissionVM) {
            customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data, index1) => {
                data.coverages.map((nestedData, index2) => {
                    if (nestedData.publicID === messages.ANCMotorLegalExpensesCovExt) {
                        const covaragePath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2];
                        _.set(covaragePath, 'selected', targetValue === messages.smallYes);
                        _.set(covaragePath, 'updated', targetValue === messages.smallYes);
                        if (apiCallFlag) {
                            setAPITriggerPoint(true);
                            setLoading(true);
                            dispatch(updateQuoteCoverages(customizeSubmissionVM));
                        } else {
                            setIncludeExpensesCover(true);
                            dispatch(updateAncillaryJourney(MOTOR_LEGAL));
                        }
                    }
                    return null;
                });
                return null;
            });
        }
    };

    const handleClickToggle = (event) => {
        setSelectedValue(event.target.value);
        setPreselectedValue(false);
        setMotorLegalExpense(event.target.value);
        if (event.target.value === messages.trueString
            || event.target.value === messages.smallYes
            || event.target.getAttribute('previousvalue') === messages.trueString
            || event.target.getAttribute('previousvalue') === messages.smallYes) {
            callUpdateQuoteCoverages(event.target.value, true);
        } else if (event.target.value === messages.smallNo && oneTimeSelectedValue === messages.smallYes) {
            callUpdateQuoteCoverages(event.target.value, true);
        } else {
            callUpdateQuoteCoverages(event.target.value, false);
        }
    };

    const handleClickContinue = () => {
        setIncludeExpensesCover(true);
    };

    // handle file download
    const handleDownloadFile = () => {
        const ipiddata = _.get(ancillaryJourneyDataModel, 'ipidsInfo', []);
        if (ipiddata.length) {
            ipiddata.forEach((data) => {
                const isAncillaryCode = data.ancillaryCode || '';
                if (isAncillaryCode === messages.ANCMotorLegalExpensesCovExt) {
                    const docParam = iPidAncillaryAPIObject(data, customizeSubmissionVM);
                    if (isSafariAndiOS()) {
                        // Open new window to download the file
                        window.open(generateDownloadableLink(docParam, MOTOR_LEGAL), '_blank');
                    } else {
                        dispatch(getIpidDocumnet(docParam, MOTOR_LEGAL));
                    }
                }
            });
        } else {
            // TODO : Error handeling if documnet is not available
        }
    };

    const pleaseCheckInfoCard = (
        <HDInfoCardRefactor
            id="motor-legal-make-sure-info-card"
            image={tipCirclePurple}
            paragraphs={[messages.coveredAlreadyCoveredPersonMessage]}
            theme="light"
            size="thin"
            className="mt-3 mt-md-4" />
    );

    const isTruthy = motorLegalExpense === messages.smallYes || motorLegalExpense === messages.trueString;
    const motorLegalFooter = () => {
        const { producerCode } = customizeSubmissionVM;
        let producerIconKey = '';
        if (producerCode && producerCode.value !== 'Default' && producerCode.value !== 'ClearScore') {
            producerIconKey = getPCWName(producerCode.value);
        }
        switch (motorLegalPage) {
            case messages.SMALL_HP:
                return (
                    <>
                        <HDQuoteInfoRefactor>
                            <span>{messages.pageInfoTextHPFirst}</span>
                            <span className="font-bold">{messages.pageInfoTextHPSecond}</span>
                            <span>{messages.pageInfoTextHPThird}</span>
                        </HDQuoteInfoRefactor>
                        <Row className="my-3 my-md-4">
                            <Col md={6}>
                                <HDButton
                                    webAnalyticsEvent={{ event_action: messages.pageInfoTextPCWSecond }}
                                    id="navigation-pcw-button"
                                    size="lg"
                                    label="Continue"
                                    onClick={handleClickContinue}
                                    className="w-100 theme-white" />
                            </Col>
                        </Row>
                        <Row>
                            {loading ? (
                                <Col>
                                    <LoadingOverlay
                                        active={loading}
                                        spinner={loading}
                                        text={messages.spinnerText} />
                                </Col>
                            ) : null}
                        </Row>
                        {pleaseCheckInfoCard}
                    </>
                );
            case messages.SMALL_PCW:
                return (
                    <>
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: messages.motorLegalCoverExpense }}
                            id="motor-legal-cover-expense-button-group"
                            availableValues={availableValues}
                            label={{
                                text: messages.motorLegalCoverQuestion(motorLegalCoverExpense || messages.defaultAmount),
                                Tag: 'h2',
                                id: 'motor-legal-do-you-need-label',
                                className: 'mb-3'
                            }}
                            value={motorLegalExpense}
                            onChange={handleClickToggle}
                            btnGroupClassName="grid grid--col-2 grid--col-md-3 gap-md"
                            btnClassName="theme-white" />
                        {isTruthy && preSelectedValue && isMotorLegalChosen && (
                            <HDQuoteInfoRefactor className="my-3 my-md-4">
                                <span>{messages.pageInfoTextPCWFirst}</span>
                                <span><b>{producerIconKey}</b></span>
                            </HDQuoteInfoRefactor>
                        )}
                        <Row className="my-3 my-md-4">
                            <Col md={6}>
                                {((isTruthy && preSelectedValue) || (ancillaryJourneyDataModel.motorLegal && canShowContinue)) && (
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: messages.pageInfoTextHPSecond }}
                                        id="navigation-pcw-button"
                                        size="lg"
                                        label="Continue"
                                        onClick={handleClickContinue}
                                        className="w-100 theme-white" />
                                )}
                            </Col>
                        </Row>
                        <Row>
                            {loading ? (
                                <Col>
                                    <LoadingOverlay
                                        active={loading}
                                        spinner={loading}
                                        text={messages.spinnerText} />
                                </Col>
                            ) : null}
                        </Row>
                        {pleaseCheckInfoCard}
                    </>
                );
            default:
                return (
                    <>
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.legalCover}` }}
                            id="motor-legal-cover-expense-button-group"
                            availableValues={availableValues}
                            label={{
                                text: messages.motorLegalCoverQuestion(motorLegalCoverExpense || messages.defaultAmount),
                                Tag: 'h2',
                                id: 'motor-legal-do-you-need-label',
                                className: 'mb-3'
                            }}
                            value={motorLegalExpense}
                            onChange={handleClickToggle}
                            btnGroupClassName="grid grid--col-2 grid--col-md-3 gap-md"
                            btnClassName="theme-white" />
                        {(motorLegalExpense !== null && ancSelectionState && canShowContinue) && (
                            <Row className="my-3 my-md-4">
                                <Col md={6}>
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: messages.continueLabel }}
                                        id="navigation-pcw-button"
                                        size="lg"
                                        label="Continue"
                                        onClick={handleClickContinue}
                                        className="w-100 theme-white" />
                                </Col>
                            </Row>
                        )}
                        {pleaseCheckInfoCard}
                        <Row>
                            {loading ? (
                                <Col>
                                    <LoadingOverlay
                                        active={loading}
                                        spinner={loading}
                                        text={messages.spinnerText} />
                                </Col>
                            ) : null}
                        </Row>
                    </>

                );
        }
    };

    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 8, offset: 2 }
    };

    return (
        <Container>
            <Row className="motor-legal-container theme-white padding-bottom-xl pt-4">
                <Col {...mainColProps}>
                    <div className="container--anc">
                        {displayPNCDPage && (
                            <div className="back-navigation-motor-legal">
                                <BackNavigation
                                    id="backNavMainWizard"
                                    className="back-button"
                                    onClick={handleBack}
                                    onKeyPress={handleBack} />
                            </div>
                        )}
                        <HDLabelRefactor
                            icon={<img src={motorLegalIcon} alt="Motor Legal Icon" />}
                            Tag="h2"
                            iconPosition="r"
                            adjustImagePosition={false}
                            text={messages.pageTitle}
                            additionalContent={motorLegalPage === messages.SMALL_HP
                            && <h3 className="d-lg-inline text-lg-xxl-1 mt-2 mt-lg-0">{messages.pageTitleHP}</h3>}
                            className="motor-legal__title-label mb-3"
                            id="motor-legal-title-label" />
                        <p id="motor-legal-intro-text-label">
                            {motorLegalPage === messages.SMALL_HP ? messages.pageParagraphFirstHP : messages.pageParagraphFirst}
                        </p>
                        <div>
                            <div className="motor-legal__details mt-3">
                                <div className="motor-legal__details__list-items pr-sm-3 flex-grow-1 mb-3">
                                    {messages.featuresYouGet.map((item) => (
                                        <HDLabelRefactor
                                            Tag="p"
                                            text={item}
                                            icon={<img src={BlueTick} alt={messages.tick} />}
                                            iconPosition="l"
                                            className="mb-2" />
                                    ))}
                                </div>
                                <div className="motor-legal__details__img-wrapper">
                                    <img src={defaqtoSrc} alt="defaqto" className="motor-legal__details__img-wrapper__defaqto-img mt-1 mt-sm-0" />
                                </div>
                                <div className="motor-legal__details__paragraphs pr-3 pr-sm-0">
                                    <p>{messages.pageInfoTextFirst}</p>
                                </div>
                            </div>
                            <p>{messages.pageInfoTextSecond}</p>
                        </div>
                        <HDLabelRefactor
                            id="motor-legal-link"
                            Tag="a"
                            text={messages.pageLinkText}
                            role="button"
                            tabIndex={0}
                            onClick={handleDownloadFile}
                            onKeyDown={handleDownloadFile}
                            className="motor-legal__pageLinkText my-3 my-md-4" />
                        {motorLegalFooter()}
                    </div>
                    {HDToast}
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
        updateQuoteCoveragesData: state.updateQuoteCoveragesModel,
        ancillaryJourneyDataModel: state.ancillaryJourneyModel,
        actionType: state.wizardState.app.actionType
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    updateQuoteCoverages,
    updateAncillaryJourney,
    getIpidDocumnet,
    setNavigation
});

HDMotorLegalPage.propTypes = {
    location: PropTypes.shape({ search: PropTypes.string, state: PropTypes.shape({ PCWJourney: PropTypes.bool }) }).isRequired,
    customizeSubmissionVM: PropTypes.shape({
        value: PropTypes.object,
        quote: PropTypes.shape({ branchCode: PropTypes.string }),
        producerCode: PropTypes.string,
    }),
    showManualDowngrade: PropTypes.bool.isRequired,
    setShowManualDowngrade: PropTypes.func.isRequired,
    onUpgradeDowngradeCancellation: PropTypes.func,
    updateQuoteCoveragesData: PropTypes.shape({
        quoteCoveragesObj: PropTypes.shape({
            quote: PropTypes.shape({}),
            quoteID: PropTypes.string,
            sessionUUID: PropTypes.string,
            periodStartDate: PropTypes.string,
            periodEndDate: PropTypes.string,
            coverType: PropTypes.string,
            voluntaryExcess: PropTypes.string,
            ncdgrantedYears: PropTypes.string,
            ncdgrantedProtectionInd: PropTypes.bool,
            producerCode: PropTypes.string,
            insurancePaymentType: PropTypes.string,
            otherQuotes: PropTypes.shape({}),
            coverages: PropTypes.shape({}),
            coverables: PropTypes.shape({ vehicles: PropTypes.array })
        }),
        quoteCoveragesError: PropTypes.shape({})
    }),
    toggleContinueElement: PropTypes.func,
    navigate: PropTypes.func,
    dispatch: PropTypes.shape({}),
    ancillaryJourneyDataModel: PropTypes.shape({ motorLegal: PropTypes.bool }),
    onUpgrade: PropTypes.func,
    onDowngrade: PropTypes.func,
    onGoBack: PropTypes.func,
    displayPNCDPage: PropTypes.bool,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    actionType: PropTypes.string
};

HDMotorLegalPage.defaultProps = {
    toggleContinueElement: () => {
    },
    navigate: () => {
    },
    dispatch: null,
    updateQuoteCoveragesData: null,
    customizeSubmissionVM: null,
    ancillaryJourneyDataModel: null,
    onUpgradeDowngradeCancellation: () => { },
    onUpgrade: () => { },
    onDowngrade: () => { },
    onGoBack: () => { },
    displayPNCDPage: false,
    actionType: null
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDMotorLegalPage));
