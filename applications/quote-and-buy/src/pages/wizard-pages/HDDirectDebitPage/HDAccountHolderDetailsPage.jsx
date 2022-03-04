/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable array-callback-return */
import React, { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
    HDLabelRefactor, HDForm, yup, HDAlert
} from 'hastings-components';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HastingsAddressLookupService } from 'hastings-capability-addresslookup';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import * as messages from './HDAccountHolderDetails.messages';
import useLoader from '../../Controls/Loader/useFullscreenLoader';
import directDebitLogo from '../../../assets/images/icons/logo-direct-debit-black.svg';
import {
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDButton as HDButton,
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDModal as HDModal
} from '../../../web-analytics';
import { pageMetadataPropTypes } from '../../../constant/propTypes';

const HDAccountHolderDetailsPage = (props) => {
    const { updateDDIVM, onFormValidation, pageMetadata } = props;

    const translator = useContext(TranslatorContext);

    let prefixes;
    const country = 'GB';
    const payerDetails = 'payerDetails';
    const payerAddress = 'payerAddress';
    const firstName = 'firstName';
    const surName = 'lastName';
    const prefix = 'prefix';
    const driverFirstName = `${payerDetails}.${firstName}`;
    const driverLastName = `${payerDetails}.${surName}`;
    const payerAddressPath = `${payerAddress}`;
    const [postCode, setPostCode] = useState('');
    const [HDLoader, showLoader, hideLoader] = useLoader();
    const [addressLookupError, setAddressLookupError] = useState(null);
    const [matchAddresses, setMatchAddresses] = useState([]);
    const [driverAddress, setDriverAddress] = useState({});
    const prefixCodes = ['003_Mr', '004', '005_Ms', '002', '005', '003'];
    const prefixPath = `${payerDetails}.${prefix}`;
    const [titles, setTitles] = useState([]);
    const [counter, setCounter] = useState(-1);
    const [selectedTitle, setSelectedTitle] = useState([]);
    const [defaultTitleData, setDefaultTitleData] = useState([]);
    const [defaultAddress, setDefaultAddress] = useState([]);
    const [showDirectDebitOverlay, setShowDirectDebitOverlay] = useState(false);
    const [firstNameInputValue, setFirstNameInputValue] = useState('');
    const [lastNameInputValue, setLastNameInputValue] = useState('');

    const getAvailableValues = (prefixCodeArray) => prefixCodeArray.map((code) => {
        const singlePrefix = prefixes.find((element) => code === element.code);
        return {
            code: singlePrefix.code,
            name: translator({
                id: singlePrefix.name,
                defaultMessage: singlePrefix.name
            })
        };
    });

    const manualFormValidation = () => {
        return _.get(updateDDIVM, 'payerDetails.firstName.aspects.valid', false) && _.get(updateDDIVM, 'payerDetails.lastName.aspects.valid', false);
    };

    const validateFormOnEvent = (event) => {
        if (event.target && event.target !== null) {
            const formData = {
                driverDetails: {
                    prefix: defaultTitleData.value,
                    firstName: firstNameInputValue,
                    lastName: lastNameInputValue,
                },
                driverAddress: {
                    addressLine1: defaultAddress.value ? defaultAddress.value.addressLine1 : '',
                    city: defaultAddress.value ? defaultAddress.value.city : '',
                    county: defaultAddress.value ? defaultAddress.value.county : '',
                    postalCode: postCode,
                    country: 'GB'
                }
            };
            let inputValue;
            if (event.target.name === 'payerAddressPath') {
                inputValue = event.target.value.label;
                formData.driverAddress = {
                    addressLine1: event.target.value.value ? event.target.value.value.addressLine1 : '',
                    city: event.target.value.value ? event.target.value.value.city : '',
                    county: event.target.value.value ? event.target.value.value.county : '',
                    postalCode: postCode,
                    country: 'GB'
                };
            } else if (event.target.prefix) {
                titles.forEach((title) => {
                    if (title.value.indexOf(event.target.prefix) !== -1) {
                        formData.driverDetails.prefix = title;
                    }
                });
                inputValue = event.target.prefix;
            } else if (event.target.name === 'postcode' && (!defaultAddress.value
                || event.target.value !== defaultAddress.value.postalCode)) {
                setMatchAddresses([]);
            } else {
                inputValue = event.target.value;
            }
            if (inputValue && inputValue.trim().length > 0 && manualFormValidation()) {
                let isFormValid = true;
                if (firstNameInputValue.trim().length === 0) { isFormValid = false; }
                if (lastNameInputValue.trim().length === 0) { isFormValid = false; }
                if (postCode.trim().length === 0) { isFormValid = false; }
                if (driverAddress.length === 0) { isFormValid = false; }
                onFormValidation({ formName: 'accountHolderDetails', value: isFormValid, dataForUpdate: formData });
            } else {
                onFormValidation({ formName: 'accountHolderDetails', value: false, dataForUpdate: formData });
            }
        }
    };

    const validateFormOnFindAddress = (addressVal, valid) => {
        const formData = {
            driverDetails: {
                prefix: defaultTitleData.value,
                firstName: firstNameInputValue,
                lastName: lastNameInputValue,
            },
            driverAddress: {
                addressLine1: addressVal ? addressVal.addressLine1 : '',
                city: addressVal ? addressVal.city : '',
                county: addressVal ? addressVal.county : '',
                postalCode: postCode,
                country: 'GB'
            }
        };
        let isFormValid = valid;
        if (firstNameInputValue.trim().length === 0) { isFormValid = false; }
        if (lastNameInputValue.trim().length === 0) { isFormValid = false; }
        if (postCode.trim().length === 0) { isFormValid = false; }
        if (driverAddress.length === 0) { isFormValid = false; }
        onFormValidation({ formName: 'accountHolderDetails', value: isFormValid, dataForUpdate: formData });
    };

    useEffect(() => {
        prefixes = _.get(updateDDIVM, 'payerDetails.prefix.aspects.availableValues');
        setPostCode(_.get(updateDDIVM, 'value.payerAddress.postalCode', ''));
        setFirstNameInputValue(_.get(updateDDIVM, 'payerDetails.firstName.value'));
        setLastNameInputValue(_.get(updateDDIVM, 'payerDetails.lastName.value'));
        const findPrimaryAddress = _.get(updateDDIVM, 'value.payerAddress');
        if (findPrimaryAddress && counter < 0) {
            setCounter(0);
            setMatchAddresses([{ address: findPrimaryAddress }]);
        }
        const currentPrefix = _.get(updateDDIVM, `${prefixPath}.value`);
        setTitles([...getAvailableValues(prefixCodes)].map((el) => ({ name: el.name, value: el.code })));
        if (currentPrefix) {
            setSelectedTitle([...getAvailableValues([currentPrefix.code])].map((el) => ({ name: el.name, value: el.code })));
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line prefer-const
        let data = {};
        selectedTitle.map((title) => {
            data.label = title.name;
            data.value = title;
        });
        setDefaultTitleData(data);
    }, [selectedTitle]);

    useEffect(() => {
        // eslint-disable-next-line prefer-const
        let address = {};
        const selectedAddress = matchAddresses.slice(0, 1);
        selectedAddress.map((data) => {
            const addressData = data.address;
            address.label = [addressData.addressLine1, addressData.addressLine2, addressData.addressLine3, addressData.city].filter((e) => e).join(', ');
            address.value = addressData;
        });
        setDefaultAddress(address);
    }, [matchAddresses]);

    const validationSchema = yup.object({
        [firstName]: yup.string()
            .required(messages.requiredAnswer)
            .max(30, messages.generalErrorMessage)
            .matches(/^[^-\s]+([A-Za-z'\s-])*$/, messages.generalErrorMessage)
            .VMValidation(driverFirstName, null, updateDDIVM),
        [surName]: yup.string()
            .matches(/^[^-\s]+([A-Za-z'\s-])*$/, messages.generalErrorMessage)
            .max(30, messages.generalErrorMessage)
            .required(messages.requiredAnswer)
            .VMValidation(driverLastName, null, updateDDIVM)
    });

    const updateAddress = (value) => {
        const addressVal = {
            ...value.address,
            country
        };
        _.set(updateDDIVM.value, 'payerAddress', addressVal);
        validateFormOnFindAddress(addressVal, true);
    };

    const lookupAddressByPostCode = () => {
        showLoader();
        setAddressLookupError(null);
        setMatchAddresses([]);
        HastingsAddressLookupService.lookupAddressByPostCode(postCode.replace(/\s+/g, ''))
            .then(({ result: { matches } }) => {
                setMatchAddresses(matches);
                trackAPICallSuccess(messages.lookupAddressByPostCode);
                updateAddress(matches[0]);
            })
            .catch(() => {
                setAddressLookupError(postCode ? messages.postcodeValidationMessage : messages.requiredFieldMessage);
                validateFormOnFindAddress('', false);
                trackAPICallFail(messages.lookupAddressByPostCode, postCode ? messages.invalidPostcode : messages.missingPostcode);
            })
            .finally(() => {
                hideLoader();
                setDriverAddress({});
                validateFormOnFindAddress();
            });
    };

    const handleDriverAddress = (e) => {
        const address = {
            ...e.target.value.value,
            country
        };
        setDriverAddress(address);
        const data = {};
        data.label = e.target.value.label;
        data.value = e.target.value.value;
        setDefaultAddress(data);
        _.set(updateDDIVM.value, 'payerAddress', address);
        validateFormOnEvent(e);
    };

    const getDisplayedAddress = ({
        addressLine1,
        addressLine2,
        addressLine3,
        city
    }) => [addressLine1, addressLine2, addressLine3, city].filter((e) => e)
        .join(', ');

    const handleTitleChange = (e) => {
        const data = {};
        data.label = e.target.value.label;
        data.value = e.target.value.value;
        const eventForValidation = { target: { prefix: data.value } };

        validateFormOnEvent(eventForValidation);
        setDefaultTitleData(data);
    };

    const displayDirectDebitOverlay = () => {
        setShowDirectDebitOverlay(true);
    };

    const closeDirectDebitOverlay = () => {
        setShowDirectDebitOverlay(false);
    };

    const titleValues = titles.map((title) => {
        const option = {};
        option.label = title.name;
        option.value = title.value;
        return option;
    });

    return (
        <Row className="account-holder-details theme-white">
            <Col>
                <Row>
                    <Col>
                        <img src={directDebitLogo} alt="direct debit logo" className="account-holder-details__direct-debit-image" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <HDLabelRefactor className="account-holder-details__header-label mb-2" Tag="h2" text={messages.headerText} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <HDLabelRefactor Tag="h5" className="account-holder-details__main-desc" text={messages.mainDescription} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>{messages.descriptionOne}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ul className="pad-inl-start-sm">
                            <li>{messages.descriptionTwo}</li>
                            <li>
                                {messages.descriptionThree}
                                <HDLabelRefactor
                                    Tag="a"
                                    text={messages.directDebitText}
                                    className="account-holder-details__link p-0"
                                    onClick={displayDirectDebitOverlay} />
                                .
                            </li>
                            <li>{messages.descriptionFour}</li>
                        </ul>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <p>{messages.note}</p>
                    </Col>
                </Row>
                <HDModal
                    webAnalyticsEvent={{ event_action: `${messages.summary} - ${messages.directDebitHeader} Info` }}
                    webAnalyticsView={{ ...pageMetadata, page_section: `${messages.summary} - ${messages.directDebitHeader} Info ` }}
                    id="direct-debit-modal"
                    show={showDirectDebitOverlay}
                    customStyle={messages.wide}
                    headerText={messages.directDebitHeader}
                    onClose={closeDirectDebitOverlay}
                    hideFooter
                >
                    <Row>
                        <Col>
                            <p>{messages.accHolderDetailsOverlayBodyOne}</p>
                            <p>{messages.accHolderDetailsOverlayBodyTwo}</p>
                            <p>{messages.accHolderDetailsOverlayBodyThree}</p>
                            <p>{messages.accHolderDetailsOverlayBodyFour}</p>
                            <p>{messages.accHolderDetailsOverlayBodyFive}</p>
                            <p>{messages.accHolderDetailsOverlayBodySix}</p>
                        </Col>
                    </Row>
                </HDModal>
                <HDForm
                    submissionVM={updateDDIVM}
                    validationSchema={validationSchema}
                >
                    {(hdProps) => {
                        return (
                            <>
                                <Row className="account-holder-details__personal-detail-container px-0">
                                    <Col className="pr-md-5" xs={12} md={9}>
                                        <Row>
                                            <Col>
                                                <HDLabelRefactor
                                                    className="account-holder-details__personal-detail-container__label mb-3"
                                                    Tag="h5"
                                                    text={messages.title} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <HDDropdownList
                                                    customClassName="account-holder-details__personal-detail-container__dropdown"
                                                    webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.title }}
                                                    id="title-dropdown"
                                                    selectSize="lg"
                                                    path={prefixPath}
                                                    options={titleValues}
                                                    data={defaultTitleData}
                                                    onChange={(e) => handleTitleChange(e)} />
                                            </Col>
                                        </Row>
                                        <Row className="account-holder-details__Lable-text">
                                            <Col>
                                                <HDLabelRefactor
                                                    className="account-holder-details__personal-detail-container__label mb-3"
                                                    Tag="h5"
                                                    text={messages.firstName} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <HDTextInput
                                                    className="account-holder-details__personal-detail-container__input input-group--on-white"
                                                    webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.firstName }}
                                                    id="first-name-input"
                                                    placeholder="First name"
                                                    name={firstName}
                                                    path={driverFirstName}
                                                    onChange={(e) => { setFirstNameInputValue(e.nativeEvent.target.value); }}
                                                    onBlur={validateFormOnEvent}
                                                    isInvalidCustom={hdProps.touched[firstName] && !!hdProps.errors[firstName]}
                                                    customClassName={hdProps.errors[firstName] ? 'is-invalid' : ''} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <HDLabelRefactor
                                                    className="account-holder-details__personal-detail-container__label mb-3"
                                                    Tag="h5"
                                                    text={messages.lastName} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <HDTextInput
                                                    className="account-holder-details__personal-detail-container__input input-group--on-white"
                                                    webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.lastName }}
                                                    id="last-name-input"
                                                    placeholder={messages.lastName}
                                                    name={surName}
                                                    path={driverLastName}
                                                    onChange={(e) => { setLastNameInputValue(e.nativeEvent.target.value); }}
                                                    onBlur={validateFormOnEvent}
                                                    isInvalidCustom={hdProps.touched[surName] && !!hdProps.errors[surName]}
                                                    customClassName={hdProps.errors[surName] ? 'is-invalid' : ''} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className="account-holder-details__address-container px-0">
                                    <Col className="pr-md-5" xs={12} md={9}>
                                        <Row>
                                            <Col>
                                                <HDLabelRefactor
                                                    className="account-holder-details__address-container__label mb-3"
                                                    Tag="h5"
                                                    text={messages.postcode} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <HDTextInput
                                                    className="account-holder-details__address-container__input input-group--on-white"
                                                    webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.postcode }}
                                                    id="postcode"
                                                    name="postcode"
                                                    type="postcode"
                                                    size="lg"
                                                    placeholder={messages.postcodeInputPlaceholder}
                                                    value={postCode}
                                                    data={postCode}
                                                    maxLength="10"
                                                    onChange={(e) => setPostCode(e.target.value)}
                                                    onBlur={validateFormOnEvent} />
                                                {<div className="error-container"><HDAlert message={addressLookupError} /></div>}
                                            </Col>
                                        </Row>
                                        <Row className="mb-4">
                                            <Col>
                                                <HDButton
                                                    className="account-holder-details__address-container__button theme-white w-100"
                                                    variant="secondary"
                                                    webAnalyticsEvent={{ event_action: messages.summary }}
                                                    id="find-button"
                                                    label={messages.findButtonLabel}
                                                    onClick={lookupAddressByPostCode} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <HDLabelRefactor
                                                    className="account-holder-details__address-container__label mb-3"
                                                    Tag="h5"
                                                    text={messages.firstLineOfAddress} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <HDDropdownList
                                                    customClassName="account-holder-details__address-container__dropdown"
                                                    webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.firstLineOfAddress }}
                                                    id="first-address-line-dropdown"
                                                    selectSize="lg"
                                                    name="payerAddressPath"
                                                    path={payerAddressPath}
                                                    options={matchAddresses.map(({ address }) => ({
                                                        value: address,
                                                        label: getDisplayedAddress(address)
                                                    }))}
                                                    placeholder={messages.addressesDropdownPlaceholder}
                                                    onChange={(e) => handleDriverAddress(e)}
                                                    value={matchAddresses.map(({ address }) => ({
                                                        value: address,
                                                        label: getDisplayedAddress(address)
                                                    }))}
                                                    data={defaultAddress} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        );
                    }}
                </HDForm>
                {HDLoader}
                <hr className="mx-0" />
            </Col>
        </Row>
    );
};


HDAccountHolderDetailsPage.propTypes = {
    updateDDIVM: PropTypes.shape({ value: PropTypes.object.isRequired }).isRequired,
    onFormValidation: PropTypes.func,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
};
HDAccountHolderDetailsPage.defaultProps = {
    onFormValidation: () => {}
};

const mapStateToProps = (state) => {
    return {
        updateDDIVM: state.wizardState.data.updateDDIVM
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(HDAccountHolderDetailsPage);
