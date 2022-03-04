import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';
import _ from 'lodash';
import {
    HDLabelRefactor,
    HDQuoteTable,
    HDQuoteInfoRefactor,
    HDQuoteDownloadRefactor
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDButton as HDButton,
} from '../../../web-analytics';
import EventEmmiter from '../../../EventHandler/event';
import {
    updateQuoteCoverages,
    updateAncillaryJourney,
    getIpidDocumnet,
    setNavigation
} from '../../../redux-thunk/actions';
import useToast from '../../Controls/Toast/useToast';
import * as messages from './HDSubstituteVehiclePage.messages';
import carIcon from '../../../assets/images/wizard-images/hastings-icons/icons/car.svg';
import {
    getAmount, iPidAncillaryAPIObject,
    isSafariAndiOS,
    generateDownloadableLink
} from '../../../common/utils';
import { SUBSTITUTE_VEHICLE, provisionalLicenceTypes } from '../../../constant/const';

const HDSubstituteVehiclePage = (props) => {
    const {
        pageMetadata, dispatch, customizeSubmissionVM, updateQuoteCoveragesData, ancillaryJourneyDataModel, submissionVM
    } = props;
    const [selectedValue, setSelectedValue] = useState(null);
    const [subVehicleExpense, setSubVehicleExpense] = useState(0);
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const [oneTimeSelectedValue, setOneTimeSelectedValue] = useState(null);
    const [HDToast, addToast] = useToast();
    const [loading, setLoading] = useState(false);
    const [isProvisional, setProvisional] = useState(false);

    const isInsurancePaymentType = _.get(customizeSubmissionVM, 'value.insurancePaymentType');
    const annualAmountPath = 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount';
    const monthlyAmountPath = 'quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount';
    const monthlyPaymentObjectPath = 'value.quote.hastingsPremium.monthlyPayment';
    const driverPath = 'lobData.privateCar.coverables.drivers';
    const canShowContinue = useSelector((state) => state.wizardState.app.showContinueOnSV);

    // toggle button value
    const availableValues = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];

    // to set the toggle value and amount
    useEffect(() => {
        if (customizeSubmissionVM) {
            customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data) => {
                data.coverages.map((nestedData) => {
                    if (nestedData.publicID === messages.ANCSubstituteVehicleCovExt) {
                        if (nestedData.selected) {
                            setSelectedValue(nestedData.selected ? messages.trueString : messages.falseString);
                            dispatch(setNavigation({ showContinueOnSV: true }));
                            setOneTimeSelectedValue(messages.trueString);
                        } else if (ancillaryJourneyDataModel.substituteVehicle) {
                            setSelectedValue(nestedData.selected ? messages.trueString : messages.falseString);
                            dispatch(setNavigation({ showContinueOnSV: true }));
                        } else {
                            setSelectedValue(null);
                        }
                        setSubVehicleExpense(nestedData.amount.amount.toLocaleString('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
                    }
                    return null;
                });
                return null;
            });
        }
        const drivers = _.get(submissionVM, `${driverPath}.value`) || [];
        const policyHolder = drivers.filter((driver) => (driver.isPolicyHolder === true))[0];
        const licenceType = (policyHolder) ? policyHolder.licenceType : null;
        if (licenceType) {
            if (provisionalLicenceTypes.includes(licenceType)) {
                setProvisional(true);
            }
        }
    }, [customizeSubmissionVM]);

    // to handle the ipid doc api error
    useEffect(() => {
        const ipiddFailureObj = _.get(ancillaryJourneyDataModel, 'ipidDocError.error');
        if (ipiddFailureObj) {
            // TODO: error handeling for ipid match for all api call
        }
    }, [ancillaryJourneyDataModel]);

    // handle the api call and update the premium
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
            addToast({
                id: 'substitute-vehicle-toast',
                webAnalyticsEvent: { event_action: `${messages.ancillaries} - ${messages.summary}`, event_value: `${selectedValue === messages.trueString ? messages.add : messages.remove} ${messages.pageTitle}` },
                webAnalyticsView: { ...pageMetadata, page_section: `${messages.ancillaries} - ${messages.summary} - ${selectedValue === messages.trueString ? messages.add : messages.remove} ${messages.pageTitle}` },
                iconType: selectedValue === messages.trueString ? 'tick' : 'cross',
                bgColor: 'main',
                content: selectedValue === messages.trueString
                    ? messages.popupMessage(subVehicleExpense || messages.defaultAmount) : messages.removedPopupMessage
            });

            dispatch(updateAncillaryJourney(SUBSTITUTE_VEHICLE));
            props.navigate(true);
        }

        if (updateQuoteCoveragesData && updateQuoteCoveragesData.quoteCoveragesError) {
            setLoading(false);
            setAPITriggerPoint(false);
        }

        const isMonthlyPaymentAvailable = _.get(customizeSubmissionVM, monthlyPaymentObjectPath, false);
        const paymentType = (isMonthlyPaymentAvailable && isInsurancePaymentType === messages.PAYMENT_TYPE_MONTHLY_CODE)
            ? messages.PAYMENT_TYPE_MONTHLY_CODE : messages.PAYMENT_TYPE_ANNUALLY_CODE;
        const annualAmount = _.get(customizeSubmissionVM, `${annualAmountPath}.value`);
        const monthlyAmount = _.get(customizeSubmissionVM, `${monthlyAmountPath}.value`);
        EventEmmiter.dispatch('change', getAmount(paymentType, annualAmount, monthlyAmount));
    }, [updateQuoteCoveragesData, customizeSubmissionVM]);

    useEffect(() => {
        props.toggleContinueElement(false); // pass false to explicitly make parent continue button invisible
    }, [props]);

    const callUpdateQuoteCoveragesAPI = (targetValue, apiCallFlag) => {
        if (customizeSubmissionVM) {
            customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data, index1) => {
                data.coverages.map((nestedData, index2) => {
                    if (nestedData.publicID === messages.ANCSubstituteVehicleCovExt) {
                        const covaragePath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2];
                        _.set(covaragePath, 'selected', targetValue === messages.trueString);
                        _.set(covaragePath, 'updated', targetValue === messages.trueString);
                        if (apiCallFlag) {
                            setAPITriggerPoint(true);
                            setLoading(true);
                            dispatch(updateQuoteCoverages(customizeSubmissionVM));
                        } else {
                            dispatch(updateAncillaryJourney(SUBSTITUTE_VEHICLE));
                            props.navigate(true);
                        }
                    }
                    return null;
                });
                return null;
            });
        }
    };

    // toggle button change
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        if (event.target.value === messages.trueString
            || event.target.value === messages.smallYes
            || event.target.getAttribute('previousvalue') === messages.trueString
            || event.target.getAttribute('previousvalue') === messages.smallYes) {
            callUpdateQuoteCoveragesAPI(event.target.value, true);
        } else if (event.target.value === messages.falseString && oneTimeSelectedValue === messages.trueString) {
            callUpdateQuoteCoveragesAPI(event.target.value, true);
        } else {
            callUpdateQuoteCoveragesAPI(event.target.value, false);
        }
    };

    // continue button event
    const handleClickContinue = () => {
        dispatch(updateAncillaryJourney(SUBSTITUTE_VEHICLE));
        props.navigate(true);
    };

    // handle file download
    const handleDownloadFile = () => {
        const ipiddata = _.get(ancillaryJourneyDataModel, 'ipidsInfo', []);
        if (ipiddata.length) {
            ipiddata.forEach((data) => {
                const isAncillaryCode = data.ancillaryCode || '';
                if (isAncillaryCode === messages.ANCSubstituteVehicleCovExt) {
                    const docParam = iPidAncillaryAPIObject(data, customizeSubmissionVM);
                    if (isSafariAndiOS()) {
                        // Open new window to download the file
                        window.open(generateDownloadableLink(docParam, SUBSTITUTE_VEHICLE), '_blank');
                    } else {
                        dispatch(getIpidDocumnet(docParam, SUBSTITUTE_VEHICLE));
                    }
                }
            });
        } else {
            // TODO : Error handeling if documnet is not available
        }
    };

    const tableData = [
        {
            name: messages.providedWhenBeingRepaired,
            values: [
                {
                    value: true,
                    subheader: <span className="text-small">{messages.forDurationOfRepairs}</span>
                },
                false
            ]
        },
        {
            name: messages.providedStolenWrittenOff,
            values: [
                false,
                {
                    value: true,
                    subheader: <span className="text-small font-regular">{messages.forUpTo28Days}</span>
                }
            ]
        },
        {
            name: messages.providedIfCarCantBeRepaired,
            values: [
                false,
                {
                    value: true,
                    subheader: <span className="text-small font-regular">{messages.forUpTo28Days}</span>
                }
            ]
        },
        {
            name: (
                <>
                    {messages.carOfSimilarEngineSizeAndSeats}
                    <br />
                    {messages.upTo2000CCAnd7Seats}
                </>
            ),
            values: [false, true]
        },
        { name: messages.deliveredToYourHome, values: [false, true] }
    ];

    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 8, offset: 2 }
    };

    return (
        <Container>
            <Row className="substitute-vehicle-container theme-white margin-bottom-lg pt-3">
                <Col {...mainColProps}>
                    <div className="container--anc">
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.pageTitle}
                            icon={<img src={carIcon} alt="Substitute Vehicle Icon" />}
                            iconPosition="r"
                            className="substitute-vehicle__title-label align-items-center mb-2"
                            id="substitute-vehicle-title-label" />
                        <p className="substitute-vehicle__main-text margin-bottom-lg">
                            {messages.pageParagraphFirst}
                            <span className="font-bold">{messages.pageParagraphSecond}</span>
                            {messages.pageParagraphThird}
                        </p>
                        <Row className="mt-3 mt-md-4">
                            <Col className="px-mobile-0">
                                <HDQuoteTable
                                    data={tableData}
                                    headerValues={messages.headerValues} />
                            </Col>
                        </Row>
                        <HDQuoteInfoRefactor>
                            <span>{messages.pageInfoText}</span>
                        </HDQuoteInfoRefactor>
                        <HDLabelRefactor
                            Tag="a"
                            text={messages.pageLinkText}
                            onClick={handleDownloadFile}
                            className="substitute-vehicle__ipid-link" />
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.substituteVehicle}` }}
                            id="substitute-vehicle-button-group"
                            name="substitute-vehicle-selection"
                            availableValues={availableValues}
                            label={{
                                text: messages.pageAddSubstituteVehicleTitle(subVehicleExpense || messages.defaultAmount),
                                Tag: 'h2',
                                id: 'substitute-vehicle-do-you-need-label',
                                className: 'margin-bottom-lg'
                            }}
                            value={selectedValue}
                            onChange={handleChange}
                            btnGroupClassName="grid grid--col-2 grid--col-md-3 gap-md"
                            btnClassName={isProvisional ? 'bg-light text-secondary border-secondary' : 'theme-white'}
                            disabled={isProvisional} />
                        {isProvisional && (
                            <HDQuoteInfoRefactor>
                                <span>{messages.infoTipText}</span>
                            </HDQuoteInfoRefactor>
                        )}
                        {(((selectedValue === messages.trueString || selectedValue === messages.falseString) && canShowContinue) || isProvisional) && (
                            <Row className="margin-top-lg">
                                <Col md={6}>
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.substituteVehicle}` }}
                                        id="substitute-vehicle-continue-btn"
                                        size="lg"
                                        label="Continue"
                                        onClick={handleClickContinue}
                                        className="w-100 theme-white" />
                                </Col>
                            </Row>
                        )}
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
        ancillaryJourneyDataModel: state.ancillaryJourneyModel
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    updateQuoteCoverages,
    updateAncillaryJourney,
    getIpidDocumnet,
    setNavigation
});

HDSubstituteVehiclePage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    dispatch: PropTypes.func.isRequired,
    toggleContinueElement: PropTypes.func,
    navigate: PropTypes.func,
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
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    ancillaryJourneyDataModel: PropTypes.shape({ substituteVehicle: PropTypes.bool }),
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

HDSubstituteVehiclePage.defaultProps = {
    navigate: () => {
    },
    toggleContinueElement: () => {
    },
    updateQuoteCoveragesData: null,
    customizeSubmissionVM: null,
    ancillaryJourneyDataModel: null
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDSubstituteVehiclePage));
