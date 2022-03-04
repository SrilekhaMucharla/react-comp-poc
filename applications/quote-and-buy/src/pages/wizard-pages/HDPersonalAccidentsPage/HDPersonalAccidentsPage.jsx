import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import dayjs from 'dayjs';
import {
    HDLabelRefactor, HDQuoteTable, HDQuoteDownloadRefactor, HDQuoteInfoRefactor, HDInfoCardRefactor
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import { Container, Col, Row } from 'react-bootstrap';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDButton as HDButton
} from '../../../web-analytics';
import EventEmmiter from '../../../EventHandler/event';
import {
    updateQuoteCoverages, updateAncillaryJourney,
    getIpidDocumnet, setNavigation
} from '../../../redux-thunk/actions';
import * as messages from './HDPersonalAccidentsPage.messages';
import {
    getAmount, iPidAncillaryAPIObject,
    isSafariAndiOS,
    generateDownloadableLink
} from '../../../common/utils';
import useToast from '../../Controls/Toast/useToast';
import { PERSONAL_ACCIDENT } from '../../../constant/const';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import personalAccidentIcon from '../../../assets/images/wizard-images/hastings-icons/icons/personal-accident.svg';
import { getDateFromParts } from '../../../common/dateHelpers';

const HDPersonalAccidentsPage = (props) => {
    const {
        pageMetadata, dispatch, submissionVM, customizeSubmissionVM, updateQuoteCoveragesData, ancillaryJourneyDataModel
    } = props;

    const [selectedValue, setSelectedValue] = useState(null);
    const [personalAccidentExpense, setPersonalAccidentExpense] = useState(0);
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const [brands, setBarands] = useState(null);
    const [oneTimeSelectedValue, setOneTimeSelectedValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [HDToast, addToast] = useToast();
    const isInsurancePaymentType = _.get(customizeSubmissionVM, 'value.insurancePaymentType');
    const coverType = _.get(submissionVM, 'value.lobData.privateCar.coverables.vehicles[0].coverType');
    const annualAmountPath = 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount';
    const monthlyAmountPath = 'quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount';
    const monthlyPaymentObjectPath = 'value.quote.hastingsPremium.monthlyPayment';
    const canShowContinue = useSelector((state) => state.wizardState.app.showContinueOnPAC);

    const availableDefaultValues = [{
        value: 'true',
        name: messages.Yes,
        icon: null
    }, {
        value: 'false',
        name: messages.No,
        icon: null
    }];

    // to set the toggle value and amount
    useEffect(() => {
        if (customizeSubmissionVM) {
            setBarands(customizeSubmissionVM.value.quote.branchCode);
            customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data) => {
                data.coverages.map((nestedData) => {
                    if (nestedData.publicID === messages.ANCMotorPersonalAccidentCovExt) {
                        if (nestedData.selected) {
                            setSelectedValue(nestedData.selected ? messages.trueString : messages.falseString);
                            dispatch(setNavigation({ showContinueOnPAC: true }));
                            setOneTimeSelectedValue(messages.trueString);
                        } else if (ancillaryJourneyDataModel.personalAccident && !checkPolicyHolderAge()) {
                            dispatch(setNavigation({ showContinueOnPAC: true }));
                            setSelectedValue(nestedData.selected ? messages.trueString : messages.falseString);
                        } else {
                            setSelectedValue(null);
                        }
                        setPersonalAccidentExpense(nestedData.amount.amount);
                    }
                    return null;
                });
                return null;
            });
        }
    }, [customizeSubmissionVM, submissionVM]);

    // to handle the ipid doc api error
    useEffect(() => {
        const ipiddFailureObj = _.get(ancillaryJourneyDataModel, 'ipidDocError.error');
        if (ipiddFailureObj) {
            // TODO: error handeling for ipid match for all api call
        }
    }, [ancillaryJourneyDataModel]);

    const getEnhancedPrice = () => {
        return (personalAccidentExpense || messages.defaultAmount);
    };

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
                id: 'personal-accident-toast',
                webAnalyticsEvent: { event_action: `${messages.ancillaries} - ${messages.summary}`, event_value: `${selectedValue === messages.trueString ? messages.add : messages.remove} ${messages.pageTitle}` },
                webAnalyticsView: { ...pageMetadata, page_section: `${messages.ancillaries} - ${messages.summary} - ${selectedValue === messages.trueString ? messages.add : messages.remove} ${messages.pageTitle}` },
                iconType: selectedValue === messages.trueString ? 'tick' : 'cross',
                bgColor: 'main',
                content: selectedValue === messages.trueString ? messages.popupMessage(getEnhancedPrice()) : messages.removedPopupMessage
            });
            if (!ancillaryJourneyDataModel.personalAccident) {
                props.navigate(true);
            }
            dispatch(updateAncillaryJourney(PERSONAL_ACCIDENT));
        }

        if (updateQuoteCoveragesData && updateQuoteCoveragesData.quoteCoveragesError && aPITriggerPoint) {
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
                    if (nestedData.publicID === messages.ANCMotorPersonalAccidentCovExt) {
                        const covaragePath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2];
                        _.set(covaragePath, 'selected', targetValue === messages.trueString);
                        _.set(covaragePath, 'updated', targetValue === messages.trueString);
                        if (apiCallFlag) {
                            setAPITriggerPoint(true);
                            setLoading(true);
                            dispatch(updateQuoteCoverages(customizeSubmissionVM));
                        } else {
                            props.navigate(true);
                            dispatch(updateAncillaryJourney(PERSONAL_ACCIDENT));
                        }
                    }
                    return null;
                });
                return null;
            });
        }
    };


    const checkPolicyHolderAge = () => {
        const driverDateOfBirthParts = _.get(submissionVM, 'value.baseData.accountHolder.dateOfBirth');
        const policyStartDateParts = _.get(submissionVM, 'value.baseData.periodStartDate');
        const holderDateOfBirth = getDateFromParts(driverDateOfBirthParts);
        const policyStartDate = getDateFromParts(policyStartDateParts);
        const ageOnPolicyStartDate = dayjs(policyStartDate).diff(holderDateOfBirth, 'year', true);

        return (ageOnPolicyStartDate >= 80);
    };

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

    const getBrand = () => {
        // const brands = ['HD', 'HP', 'HE', 'TPTF', 'TPO'];
        const brand = _.get(customizeSubmissionVM, 'value.quote.branchCode');
        return brands || brand;
    };

    const getDataforBrandTable = () => {
        const brand = getBrand();
        switch (brand) {
            case 'HD':
                return [
                    {
                        name: 'Death',
                        values: ['£5,000', '£100,000']
                    },
                    {
                        name: 'Permanent loss of sight in one or both eyes',
                        values: ['£5,000', '£100,000']
                    },
                    {
                        name: 'Loss of a limb',
                        values: ['£5,000', '£100,000']
                    },
                    {
                        name: 'Insured people',
                        values: [
                            <>
                                Policyholder and their partner
                                <div className="text-small">(aged 75 and under)</div>
                            </>,
                            <>
                                Policyholder and up to six passengers
                                <div className="text-small">(aged 79 and under)</div>
                            </>
                        ]
                    },
                    {
                        name: "Pay out if you can't carry out normal daily activities",
                        values: ['£0', '£100 per day']
                    },
                    {
                        name: 'Fractured bones',
                        values: ['£0', 'Up to £5,000']
                    }
                ];
            case 'HP':
                return [
                    {
                        name: 'Death',
                        values: ['£5,000', '£100,000']
                    },
                    {
                        name: 'Permanent loss of sight in one or both eyes',
                        values: ['£5,000', '£100,000']
                    },
                    {
                        name: 'Loss of a limb',
                        values: ['£5,000', '£100,000']
                    },
                    {
                        name: 'Insured people',
                        values: [
                            <>
                                Policyholder and their partner
                                <div className="text-small">(aged 75 and under)</div>
                            </>,
                            <>
                                Policyholder and up to six passengers
                                <div className="text-small">(aged 79 and under)</div>
                            </>
                        ]
                    },
                    {
                        name: "Pay out if you can't carry out normal daily activities",
                        values: ['£0', '£100 per day']
                    },
                    {
                        name: 'Fractured bones',
                        values: ['£0', 'Up to £5,000']
                    }
                ];
            case 'HE':
                return [
                    {
                        name: 'Death',
                        values: ['£1,000', '£100,000']
                    },
                    {
                        name: 'Permanent loss of sight in one or both eyes',
                        values: ['£1,000', '£100,000']
                    },
                    {
                        name: 'Loss of a limb',
                        values: ['£1,000', '£100,000']
                    },
                    {
                        name: 'Insured people',
                        values: [
                            <>
                                Policyholder and their partner
                                <div className="text-small">(aged 75 and under)</div>
                            </>,
                            <>
                                Policyholder and up to six passengers
                                <div className="text-small">(aged 79 and under)</div>
                            </>
                        ]
                    },
                    {
                        name: "Pay out if you can't carry out normal daily activities",
                        values: ['£0', '£100 per day']
                    },
                    {
                        name: 'Fractured bones',
                        values: ['£0', 'Up to £5,000']
                    }
                ];
            case 'YD':
                return [
                    {
                        name: 'Death',
                        values: ['£5,000', '£100,000']
                    },
                    {
                        name: 'Permanent loss of sight in one or both eyes',
                        values: ['£5,000', '£100,000']
                    },
                    {
                        name: 'Loss of a limb',
                        values: ['£5,000', '£100,000']
                    },
                    {
                        name: 'Insured people',
                        values: [
                            <>
                                Policyholder and their partner
                                <div className="text-small">(aged 75 and under)</div>
                            </>,
                            <>
                                Policyholder and up to six passengers
                                <div className="text-small">(aged 79 and under)</div>
                            </>
                        ]
                    },
                    {
                        name: "Pay out if you can't carry out normal daily activities",
                        values: ['£0', '£100 per day']
                    },
                    {
                        name: 'Fractured bones',
                        values: ['£0', 'Up to £5,000']
                    }
                ];
            case 'TPO':
                return [
                    {
                        name: 'Death',
                        values: ['£0', '£100,000']
                    },
                    {
                        name: 'Permanent loss of sight in one or both eyes',
                        values: ['£0', '£100,000']
                    },
                    {
                        name: 'Loss of a limb',
                        values: ['£0', '£100,000']
                    },
                    {
                        name: 'Insured people',
                        values: ['No one', 'Policyholder and up to six passengers']
                    },
                    {
                        name: "Pay out if you can't carry out normal daily activities",
                        values: ['£0', '£100 per day']
                    },
                    {
                        name: 'Fractured bones',
                        values: ['£0', 'Up to £5,000']
                    }
                ];
            case 'TPTF':
                return [
                    {
                        name: 'Death',
                        values: ['£0', '£100,000']
                    },
                    {
                        name: 'Permanent loss of sight in one or both eyes',
                        values: ['£0', '£100,000']
                    },
                    {
                        name: 'Loss of a limb',
                        values: ['£0', '£100,000']
                    },
                    {
                        name: 'Insured people',
                        values: ['No one', 'Policyholder and up to six passengers']
                    },
                    {
                        name: "Pay out if you can't carry out normal daily activities",
                        values: ['£0', '£100 per day']
                    },
                    {
                        name: 'Fractured bones',
                        values: ['£0', 'Up to £5,000']
                    }
                ];
            default:
                return null;
        }
    };

    const getDataforTable = () => {
        if (coverType && (coverType === messages.tpft)) {
            return [
                {
                    name: 'Death',
                    values: ['£0', '£100,000']
                },
                {
                    name: 'Permanent loss of sight in one or both eyes',
                    values: ['£0', '£100,000']
                },
                {
                    name: 'Loss of a limb',
                    values: ['£0', '£100,000']
                },
                {
                    name: 'Insured people',
                    values: [
                        <>
                            No one
                        </>,
                        <>
                            Policyholder and up to six passengers
                            <div className="text-small">(aged 79 and under)</div>
                        </>
                    ]
                },
                {
                    name: "Pay out if you can't carry out normal daily activities",
                    values: ['£0', '£100 per day']
                },
                {
                    name: 'Fractured bones',
                    values: ['£0', 'Up to £5,000']
                }
            ];
        }
        return getDataforBrandTable();
    };

    // continue button event
    const handleClickContinue = () => {
        dispatch(updateAncillaryJourney(PERSONAL_ACCIDENT));
        props.navigate(true);
    };

    // handle file download
    const handleDownloadFile = () => {
        const ipiddata = _.get(ancillaryJourneyDataModel, 'ipidsInfo', []);
        if (ipiddata.length) {
            ipiddata.forEach((data) => {
                const isAncillaryCode = data.ancillaryCode || '';
                if (isAncillaryCode === messages.ANCMotorPersonalAccidentCovExt) {
                    const docParam = iPidAncillaryAPIObject(data, customizeSubmissionVM);
                    if (isSafariAndiOS()) {
                        // Open new window to download the file
                        window.open(generateDownloadableLink(docParam, PERSONAL_ACCIDENT), '_blank');
                    } else {
                        dispatch(getIpidDocumnet(docParam, PERSONAL_ACCIDENT));
                    }
                }
            });
        } else {
            // TODO : Error handeling if documnet is not available
        }
    };

    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 8, offset: 2 }
    };

    return (
        <Container>
            <Row className="personal-accidents-container theme-white padding-bottom-xl pt-4">
                <Col {...mainColProps}>
                    <div className="container--anc">
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.pageTitle}
                            icon={<img src={personalAccidentIcon} alt="Personal Accident Icon" />}
                            iconPosition="r"
                            className="personal-accidents__title-label align-items-center mb-3"
                            id="personal-accidents-title-label" />
                        {coverType === messages.tpft ? (
                            <>
                                <p>{messages.pageInfoBottomTpft1}</p>
                                <p>{messages.pageInfoBottom('100,000')}</p>
                                <p>{messages.pageInfoBottomTpft2}</p>
                            </>
                        ) : (
                            <>
                                <p>{messages.pageInfoBottom1}</p>
                                <p>{messages.pageInfoBottom('100,000')}</p>
                                <p>{messages.pageInfoBottom2}</p>
                            </>
                        )}
                        <Row className="mt-3 mt-md-4">
                            <Col className="px-mobile-0">
                                <HDQuoteTable
                                    headerValues={[{
                                        topLabel: null,
                                        value: (coverType === messages.tpft) ? messages.tpftHeader : messages.comprehensiveHeader,
                                    }, {
                                        topLabel: (coverType === messages.tpft) ? null : 'Increased cover',
                                        value: 'Personal accident',
                                    }]}
                                    data={getDataforTable()} />
                            </Col>
                        </Row>
                        <HDQuoteInfoRefactor>
                            <span>{messages.youngPassengerCoverLimitMessage}</span>
                        </HDQuoteInfoRefactor>
                        <HDLabelRefactor
                            className="my-3 my-md-4"
                            Tag="a"
                            text={messages.readDocumentMessage}
                            onClick={handleDownloadFile} />
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.personalAccident}` }}
                            id="personal-accident-button-group"
                            name="personal-accident-cover"
                            value={selectedValue}
                            availableValues={availableDefaultValues}
                            onChange={handleChange}
                            disabled={checkPolicyHolderAge()}
                            label={{
                                text: messages.enhancedMessage(getEnhancedPrice()),
                                Tag: 'h2',
                                id: 'personal-accidents-do-you-need-label',
                                className: 'mb-3'
                            }}
                            btnGroupClassName="grid grid--col-2 grid--col-md-3 gap-md"
                            btnClassName="theme-white" />
                        {checkPolicyHolderAge() && (
                            <HDQuoteInfoRefactor>
                                <span>{messages.maxAgeCoveredPersonMessage}</span>
                            </HDQuoteInfoRefactor>
                        )}
                        {(((selectedValue === messages.trueString
                        || selectedValue === messages.falseString)
                        && canShowContinue) || checkPolicyHolderAge())
                        && (
                            <Row className="my-3 my-md-4">
                                <Col md={6}>
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.personalAccident}` }}
                                        id="personal-accidents-continue-btn"
                                        size="lg"
                                        label="Continue"
                                        onClick={handleClickContinue}
                                        className="w-100 theme-white" />
                                </Col>
                            </Row>
                        )}
                        {!checkPolicyHolderAge() && (
                            <HDInfoCardRefactor
                                id="personal-accidents-make-sure-info-card"
                                image={tipCirclePurple}
                                paragraphs={[messages.coveredAlreadyCoveredPersonMessage]}
                                theme="light"
                                size="thin"
                                className="mt-3 mt-md-4" />
                        )}
                    </div>
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
                    {HDToast}
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => ({
    customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
    updateQuoteCoveragesData: state.updateQuoteCoveragesModel,
    ancillaryJourneyDataModel: state.ancillaryJourneyModel,
    submissionVM: state.wizardState.data.submissionVM
});

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    updateQuoteCoverages,
    updateAncillaryJourney,
    getIpidDocumnet,
    setNavigation
});

HDPersonalAccidentsPage.propTypes = {
    toggleContinueElement: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
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
    submissionVM: PropTypes.shape({ value: PropTypes.object }),
    ancillaryJourneyDataModel: PropTypes.shape({ personalAccident: PropTypes.bool }),
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

HDPersonalAccidentsPage.defaultProps = {
    navigate: () => { },
    toggleContinueElement: () => { },
    updateQuoteCoveragesData: null,
    customizeSubmissionVM: null,
    ancillaryJourneyDataModel: null,
    submissionVM: null
};

export default connect(mapStateToProps, mapDispatchToProps)(HDPersonalAccidentsPage);
