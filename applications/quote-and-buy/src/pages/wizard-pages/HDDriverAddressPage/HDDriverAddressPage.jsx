/* eslint-disable react-hooks/exhaustive-deps */
import { HastingsAddressLookupService } from 'hastings-capability-addresslookup';
import {
    HDAlertRefactor,
    HDForm,
    HDInfoCardRefactor,
    HDInteractiveCardRefactor,
    HDLabelRefactor,
    HDModal
} from 'hastings-components';
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Row, Col, Container } from 'react-bootstrap';
import React, {
    useContext, useEffect, useMemo, useState
} from 'react';
import { connect, useSelector } from 'react-redux';
import {
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDButton as HDButton,
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import {
    setNavigation as setNavigationAction,
    setAddressDisplay as setAddressDisplayAction
} from '../../../redux-thunk/actions';
import * as messages from './HDDriverAddressPage.messages';
import HDManualAddressPopup from './HDManualAddressPopup';
import InfoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import EditPencil from '../../../assets/images/icons/edit_pencil.svg';
import CircleExclamation from '../../../assets/images/icons/circle-exclamation.svg';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import { driverAddressCountry, DEFAULT_PRODUCER_CODE } from '../../../constant/const';
import { producerCodeList } from '../../../common/producerCodeHelper';

const HDDriverAddressPage = ({
    submissionVM,
    setNavigation,
    pageMetadata,
    dipslayAddressAsACard,
    setAddressDisplay,
    MCsubmissionVM,
    multiCarFlag,
    dispatch
}) => {
    const [postCode, setPostCode] = useState('');
    const [matchAddresses, setMatchAddresses] = useState([]);
    const [addressLookupError, setAddressLookupError] = useState(null);
    const [driverAddress, setDriverAddress] = useState({});
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [addressValid, setAddressValid] = useState(true);
    const [addressChanged, setAddressChanged] = useState(false);
    const [addressChangedData, setAddressChangedData] = useState({});
    const [addressChangedEntry, setAddressChangedEntry] = useState('');
    const isEditQuoteJourney = useSelector((state) => state.wizardState.app.isEditQuoteJourney);

    const policyAddressPath = 'baseData.policyAddress';
    const primaryAddressPath = 'baseData.accountHolder.primaryAddress';
    const yearsLivedAtCurrentAddressPath = 'lobData.privateCar.coverables.drivers.children[0].yearsLivedAtCurrentAddress';
    const producerCodePath = 'baseData.producerCode.value';

    let producerCode = _.get(submissionVM, producerCodePath, DEFAULT_PRODUCER_CODE);
    const MCsubmissionVMQuote = _.get(MCsubmissionVM, 'value.quotes', []);
    if (MCsubmissionVMQuote.length && multiCarFlag) {
        const MCsubmissionVMParentPolicy = MCsubmissionVMQuote.find((submissionVMQuote) => submissionVMQuote.isParentPolicy);
        producerCode = _.get(MCsubmissionVMParentPolicy, 'baseData.producerCode', DEFAULT_PRODUCER_CODE);
    }
    const isNotPCW = producerCodeList.includes(producerCode);
    const translator = useContext(TranslatorContext);

    const validationSchema = isNotPCW ? yup.object({
        yearsLivedAtCurrentAddress: yup.object()
            .required(messages.yearsRequiredFieldMessage)
            .nullable()
            .VMValidation(yearsLivedAtCurrentAddressPath, null, submissionVM)
    }) : null;

    const isAddressEntered = () => {
        if (Object.keys(driverAddress).length > 0) {
            setAddressValid(true);
        } else {
            setAddressValid(false);
        }
    };

    const availableYearsValues = useMemo(() => (_.get(submissionVM, yearsLivedAtCurrentAddressPath)
        .aspects
        .availableValues
        .map((yearTC) => ({
            value: yearTC.code,
            label: translator({
                id: yearTC.name,
                defaultMessage: yearTC.name
            })
        }))), [submissionVM]);

    const lookupAddressByPostCode = (postalCode, reloading) => {
        showLoader();
        setAddressLookupError(null);
        setMatchAddresses([]);
        HastingsAddressLookupService.lookupAddressByPostCode(postalCode.replace(/\s+/g, ''))
            .then(({ result: { matches } }) => {
                setMatchAddresses(matches);
                trackAPICallSuccess(messages.lookupAddressByPostCode);
            })
            .catch(() => {
                setAddressLookupError(postalCode ? messages.postcodeValidationMessage : messages.requiredFieldMessage);
                trackAPICallFail(messages.lookupAddressByPostCode, postCode ? messages.invalidPostcode : messages.missingPostcode);
            })
            .finally(() => {
                hideLoader();
                if (!reloading) {
                    setDriverAddress({});
                }
            });
    };

    useEffect(() => {
        const existingPostCode = _.get(submissionVM, 'value.baseData.accountHolder.primaryAddress.postalCode', '');
        const findPrimaryAddress = _.get(submissionVM, 'value.baseData.accountHolder.primaryAddress');
        setPostCode(existingPostCode);
        if (existingPostCode && findPrimaryAddress && !findPrimaryAddress.manuallyAdded) {
            lookupAddressByPostCode(existingPostCode, true);
        }
        if (findPrimaryAddress) {
            setDriverAddress(findPrimaryAddress);
            if (findPrimaryAddress.manuallyAdded) {
                dispatch(setAddressDisplay(true));
            }
        }
    }, [submissionVM]);

    useEffect(() => {
        if (!_.isEmpty(driverAddress)) {
            _.set(submissionVM, policyAddressPath, driverAddress);
            _.set(submissionVM, primaryAddressPath, driverAddress);

            setAddressValid(true);
        }
    }, [driverAddress, submissionVM]);

    useEffect(() => {
        producerCodeList.push(DEFAULT_PRODUCER_CODE);
        dispatch(setNavigation({ canForward: false, showForward: true }));
    }, []);

    const handleValidation = (isValid) => {
        const quoteID = _.get(submissionVM, 'value.quoteID');
        const MCsubmissionVMQuote = _.get(MCsubmissionVM, 'value.quotes', []);
        if (quoteID || (MCsubmissionVMQuote.length && multiCarFlag)) {
            dispatch(setNavigation({
                canForward: isValid && Object.keys(driverAddress).length > 0,
                callCreateSubmission: false
            }));
        } else {
            dispatch(setNavigation({
                canForward: isValid && Object.keys(driverAddress).length > 0,
                callCreateSubmission: isValid && Object.keys(driverAddress).length > 0
            }));
        }
    };

    const getDisplayedAddress = ({
        addressLine1,
        addressLine2,
        addressLine3,
        city
    }) => [addressLine1, addressLine2, addressLine3, city].filter((e) => e)
        .join(', ');

    const handleManualEnteringAddress = (addr) => {
        const address = {
            ...addr,
            country: driverAddressCountry
        };
        dispatch(setAddressDisplay(true));
        setDriverAddress(address);
    };

    const handleDriverAddress = (e) => {
        setDriverAddress({
            ...e.target.value.value,
            country: driverAddressCountry
        });
        setAddressValid(true);
    };

    const handleAddressChanged = (data, entry) => {
        if (multiCarFlag && isEditQuoteJourney) {
            setAddressChanged(true);
            setAddressChangedData(data);
            setAddressChangedEntry(entry);
        } else if (entry === messages.manualEntry) {
            handleManualEnteringAddress(data);
        } else {
            handleDriverAddress(data);
        }
    };

    const confirmAddressChange = () => {
        dispatch(setNavigation({
            multicarAddresChanged: true
        }));
        if (addressChangedEntry === messages.manualEntry) {
            handleManualEnteringAddress(addressChangedData);
        } else {
            handleDriverAddress(addressChangedData);
        }
        setAddressChanged(false);
    };

    const handleAddressLookup = () => {
        lookupAddressByPostCode(postCode, false);
    };

    const renderAdrressLookup = () => (
        <>
            <Row>
                <Col xs={12}>
                    <HDTextInput
                        webAnalyticsEvent={{
                            event_action: messages.addressLabel
                        }}
                        id="address-page-postcode-input"
                        className="address-page__postcode-input"
                        name="postcode"
                        type="postcode"
                        size="lg"
                        placeholder={messages.postcodeInputPlaceholder}
                        value={postCode}
                        data={postCode}
                        maxLength="10"
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                handleAddressLookup();
                                const { form } = event.target;
                                const index = [...form].indexOf(event.target);
                                form.elements[index + 1].focus();
                            }
                        }}
                        onChange={(e) => {
                            setPostCode(e.target.value);
                        }}
                        isInvalidCustom={!!addressLookupError} />
                </Col>
                {addressLookupError
                    && (
                        <Col lg={12}>
                            <HDAlertRefactor message={addressLookupError} />
                        </Col>
                    )
                }
            </Row>
            <Row>
                <Col>
                    <HDButton
                        webAnalyticsEvent={{ event_action: messages.addressLabel }}
                        id="address-page-lookup-button"
                        className="address-page__lookup-button"
                        variant="secondary"
                        label={messages.findButtonLabel}
                        onClick={handleAddressLookup} />
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <HDManualAddressPopup
                        pageMetadata={pageMetadata}
                        initialAddress={driverAddress}
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        trigger={
                            <HDLabelRefactor Tag="a" text={messages.enterManually} />
                        }
                        onConfirm={(data) => handleAddressChanged(data, messages.manualEntry)} />
                </Col>
            </Row>
            {!!matchAddresses.length && (
                <HDDropdownList
                    webAnalyticsEvent={{
                        event_action: messages.addressLabel,
                        event_value: messages.selectAddress
                    }}
                    id="address-page-lookup-dropdown"
                    className="address-page__lookup-dropdown"
                    selectSize="lg"
                    name="primaryAddress"
                    path={primaryAddressPath}
                    onBlur={isAddressEntered}
                    options={matchAddresses.map(({ address }) => ({
                        value: address,
                        label: getDisplayedAddress(address)
                    }))}
                    placeholder={messages.addressesDropdownPlaceholder}
                    onChange={(e) => handleAddressChanged(e, messages.lookupEntry)}
                    data={{
                        value: driverAddress,
                        label: getDisplayedAddress(driverAddress)
                    }}
                    reset={!Object.keys(driverAddress).length}
                    theme="blue" />
            )}
            {!!matchAddresses.length && !addressValid && (<HDLabelRefactor Tag="p" className="error mb-0 p-4" text={messages.yearsRequiredFieldMessage} />)}
        </>
    );

    const renderManualAddressCard = () => {
        const {
            addressLine1,
            addressLine2,
            addressLine3,
            postalCode,
            city
        } = driverAddress;
        return (
            <HDInteractiveCardRefactor
                icons={(
                    <>
                        <HDManualAddressPopup
                            initialAddress={driverAddress}
                            trigger={(
                                <img src={EditPencil} alt="edit button" />
                            )
                            }
                            onConfirm={(data) => handleAddressChanged(data, messages.manualEntry)} />
                    </>
                )}
            >
                {addressLine1 && (<div>{`${addressLine1},`}</div>)}
                {addressLine2 && (<div>{`${addressLine2} ,`}</div>)}
                {addressLine3 && (<div>{`${addressLine3},`}</div>)}
                {postalCode && (<div>{`${postalCode} ${city}`}</div>)}
            </HDInteractiveCardRefactor>
        );
    };

    const tooltipOverlay = (id) => (
        <HDOverlayPopup
            webAnalyticsEvent={{ event_action: `${messages.address} Info` }}
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.address} Info` }}
            id={id}
            labelText={messages.tooltipContentHeader}
            overlayButtonIcon={<img src={InfoCircleBlue} alt="info-circle" />}
        >
            <p>{messages.tooltipContentFirstParagraph}</p>
            <p>{messages.tooltipSecondParagraph}</p>
        </HDOverlayPopup>
    );

    return (
        <>
            <Container className="address-page-container">
                <HDForm
                    id="address-page-form"
                    className="address-page__form"
                    submissionVM={submissionVM}
                    validationSchema={validationSchema}
                    onValidation={handleValidation}
                >
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                id="address-page-address-label"
                                className="address-page__address-label"
                                text={messages.addressLabel}
                                Tag="h2"
                                icon={tooltipOverlay('address-question')}
                                iconPosition="r" />
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col>
                            <HDInfoCardRefactor
                                id="address-page-info-card"
                                className="address-page__info-card"
                                image={CircleExclamation}
                                paragraphs={[messages.infoCardContent]} />
                        </Col>
                    </Row>
                    {dipslayAddressAsACard ? renderManualAddressCard() : renderAdrressLookup()}
                    <hr />
                    {isNotPCW && (
                        <HDDropdownList
                            webAnalyticsEvent={{ event_action: messages.yearsLabel }}
                            id="address-page-dropdown"
                            className="address-page__dropdown"
                            selectSize="lg"
                            name="yearsLivedAtCurrentAddress"
                            label={{
                                text: messages.yearsLabel,
                                Tag: 'h2',
                                className: 'address-page__year-label',
                                id: 'address-page-year-label'
                            }}
                            path={yearsLivedAtCurrentAddressPath}
                            options={availableYearsValues}
                            placeholder={messages.yearsDropdownPlaceholder}
                            theme="blue"
                            isSearchable={false}
                            enableNative />
                    )}
                </HDForm>
            </Container>
            {HDFullscreenLoader}
            <HDModal
                webAnalyticsView={{ ...pageMetadata, page_section: 'Customize quote - Rerate' }}
                webAnalyticsEvent={{ event_action: 'Customize quote - Rerate' }}
                id="address-confirm-modal"
                customStyle="customize-quote"
                show={addressChanged}
                headerText="Change address"
                confirmLabel="Confirm"
                onClose={() => setAddressChanged(false)}
                onCancel={() => setAddressChanged(false)}
                onConfirm={confirmAddressChange}
            >
                <p>
                    {messages.changeAddressAdditionalText}
                </p>
            </HDModal>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        MCsubmissionVM: state.wizardState.data.mcsubmissionVM,
        multiCarFlag: state.wizardState.app.multiCarFlag,
        dipslayAddressAsACard: state.wizardState.app.dipslayAddressAsACard
    };
};

const mapDispatchToProps = (dispatch) => ({
    setNavigation: setNavigationAction,
    setAddressDisplay: setAddressDisplayAction,
    dispatch
});

HDDriverAddressPage.defaultProps = {
    dispatch: null
};

HDDriverAddressPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    setAddressDisplay: PropTypes.func.isRequired,
    dipslayAddressAsACard: PropTypes.bool.isRequired,
    dispatch: PropTypes.shape({}),
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverAddressPage);
