import {
    HDLabelRefactor
} from 'hastings-components';
import { Row, Col } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { HastingsAddressLookupService } from 'hastings-capability-addresslookup';
import {
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDOverlayPopup as HDOverlayPopup,
} from '../../../web-analytics';
// import './HDManualAddressPopup.scss';
import * as messages from './HDManualAddressPopup.messages';
import POSTCODE_REGEX from './postCodeValidation';

const HDManualAddressPopup = ({
    initialAddress,
    trigger,
    onConfirm,
    pageMetadata
}) => {
    const [address, setAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        city: '',
        postalCode: ''
    });
    const [errors, setErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});

    const validate = async ({
        addressLine1,
        postalCode,
        city
    }) => {
        const nextErrors = {};
        if (!addressLine1) {
            nextErrors.addressLine1 = messages.requiredFieldMessage;
        }

        if (!city) {
            nextErrors.city = messages.requiredFieldMessage;
        }

        if (!postalCode) {
            nextErrors.postalCode = messages.requiredFieldMessage;
        } else if (!POSTCODE_REGEX.test(postalCode)) {
            nextErrors.postalCode = messages.invalidPostCodeMessage;
        } else {
            try {
                const { result: { matches } } = await HastingsAddressLookupService.lookupAddressByPostCode(postalCode.replace(/\s+/g, ''));
                if (!matches.length) {
                    nextErrors.postalCode = messages.invalidPostCodeMessage;
                }
            } catch (err) {
                nextErrors.postalCode = messages.invalidPostCodeMessage;
            }
        }
        setErrors(nextErrors);
    };

    const debouncedValidate = useCallback(_.debounce(validate, 500), []);

    useEffect(() => {
        debouncedValidate(address);
    }, [address, debouncedValidate]);


    const handleChange = ({ target: { name, value } }) => {
        setAddress({ ...address, [name]: value });
    };

    const handleTouched = ({ target: { name } }) => {
        if (!touchedFields[name]) {
            setTouchedFields({ ...touchedFields, [name]: true });
        }
    };

    const handleConfirm = () => {
        onConfirm({ ...address, manuallyAdded: true });
    };

    const disabledConfirmButton = () => {
        return Object.keys(errors).length > 0;
    };

    const onBeforeOpen = () => {
        setAddress(initialAddress);
        validate(address);
        setTouchedFields({});
    };

    return (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.header }}
            webAnalyticsEvent={{ event_action: messages.header }}
            id="manual-address-popup"
            className="manual-address-popup"
            overlayButtonIcon={trigger}
            confirmButton={(Object.keys(initialAddress).length) ? messages.updateLabel : messages.addLabel}
            cancelButton={messages.cancelLabel}
            onBeforeOpen={onBeforeOpen}
            onConfirm={handleConfirm}
            disabledConfirmButton={disabledConfirmButton()}
            showButtons
        >
            <Row>
                <Col>
                    <HDLabelRefactor
                        id="manual-address-popup-label"
                        className="mt-0 margin-bottom-lg"
                        text={messages.header}
                        Tag="h2" />
                </Col>
            </Row>
            <Row className="margin-bottom-md">
                <Col>
                    <HDTextInput
                        webAnalyticsEvent={{
                            event_action: messages.header
                        }}
                        id="manual-address-popup-first-field"
                        className="manual-address-popup__first-address-field input-group--on-white"
                        name="addressLine1"
                        type="alphanum"
                        placeholder={messages.addressLine1Placeholder}
                        value={address.addressLine1}
                        onChange={handleChange}
                        onBlur={handleTouched}
                        isInvalidCustom={!!errors.addressLine1 && touchedFields.addressLine1} />
                    {errors.addressLine1 && touchedFields.addressLine1 && (
                        <div className="manual-address-popup__error invalid-field">
                            {errors.addressLine1}
                        </div>
                    )}
                </Col>
            </Row>
            <Row className="margin-bottom-md">
                <Col>
                    <HDTextInput
                        webAnalyticsEvent={{
                            event_action: messages.header
                        }}
                        id="addres-line2-input"
                        className="manual-address-popup__address-field2 input-group--on-white"
                        name="addressLine2"
                        type="alphanum"
                        placeholder={messages.addressLine2Placeholder}
                        value={address.addressLine2}
                        onChange={handleChange}
                        onBlur={handleTouched} />
                </Col>
            </Row>
            <Row className="margin-bottom-md">
                <Col>
                    <HDTextInput
                        webAnalyticsEvent={{
                            event_action: messages.header
                        }}
                        id="manual-address-popup-address-field2"
                        className="manual-address-popup__address-field3 input-group--on-white"
                        name="addressLine3"
                        type="alphanum"
                        placeholder={messages.addressLine3Placeholder}
                        value={address.addressLine3}
                        onChange={handleChange} />
                </Col>
            </Row>
            <Row className="margin-bottom-md">
                <Col>
                    <HDTextInput
                        webAnalyticsEvent={{
                            event_action: messages.header
                        }}
                        id="manual-address-popup-city-field"
                        className="manual-address-popup__city-field input-group--on-white"
                        name="city"
                        type="alpha"
                        placeholder={messages.cityPlaceholder}
                        value={address.city}
                        onChange={handleChange}
                        onBlur={handleTouched}
                        isInvalidCustom={!!errors.city && touchedFields.city} />
                    {errors.city && touchedFields.city && (
                        <div className="manual-address-popup__error invalid-field">
                            {errors.city}
                        </div>
                    )}
                </Col>
            </Row>
            <Row>
                <Col>
                    <HDTextInput
                        webAnalyticsEvent={{
                            event_action: messages.header
                        }}
                        id="manual-address-popup-postcode-field"
                        className="manual-address-popup__postcode-field input-group--on-white"
                        name="postalCode"
                        type="postcode"
                        placeholder={messages.postCodePlaceholder}
                        value={address.postalCode}
                        onChange={handleChange}
                        onBlur={handleTouched}
                        isInvalidCustom={!!errors.postalCode && touchedFields.postalCode} />
                    {errors.postalCode && touchedFields.postalCode && (
                        <div className="manual-address-popup__error invalid-field">
                            {errors.postalCode}
                        </div>
                    )}
                </Col>
            </Row>
        </HDOverlayPopup>
    );
};

HDManualAddressPopup.propTypes = {
    initialAddress: PropTypes.shape({
        addressLine1: PropTypes.string,
        addressLine2: PropTypes.string,
        addressLine3: PropTypes.string,
        city: PropTypes.string,
        postalCode: PropTypes.string
    }).isRequired,
    trigger: PropTypes.node.isRequired,
    onConfirm: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

export default HDManualAddressPopup;
