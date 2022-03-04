
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import infoCircleBlue from '../../../../../applications/quote-and-buy/src/assets/images/icons/Darkicons_desktopinfo.svg';
import onlineProduct from '../../../../../applications/quote-and-buy/src/assets/images/logo/logo-online-product-color-left.png';
import standardProduct from '../../../../../applications/quote-and-buy/src/assets/images/logo/logo-standard-product-color.png';
import HDLabelRefactor from '../HDLabelRefactor/HDLabelRefactor';
import HDOverlayPopup from '../HDOverlayPopup/HDOverlayPopup';
import HDQuoteInfoRefactor from '../HDQuoteInfoRefactor/HDQuoteInfoRefactor';
import HDToggleButtonGroupRefactor from '../HDToggleButtonGroupRefactor/HDToggleButtonGroupRefactor';
import HDUpdateButton from './components/HDUpdateButton';
import * as messages from './HDPolicySelect.messages';
import { trackEvent } from '../../../../../applications/quote-and-buy/src/web-analytics/trackData';


const HDCreatePolicySelect = ({
    className,
    selectedOption,
    onChange,
    colProps,
    saveValue,
    pageMetadata,
    canHideOnlineInfo
}) => {
    const canShow = useCallback(
        () => (selectedOption === messages.online),
        [selectedOption]
    );

    const getOnlineContent = () => {
        return (
            <HDUpdateButton
                saveValue={saveValue}
                imageSource={onlineProduct}
                selectedOption={selectedOption}
                header={messages.onlineHeader}
                list={[
                    messages.commonListItem1,
                    messages.commonListItem2,
                    messages.commonListItem3,
                    messages.onlineListItem
                ]}
                id="hd-create-policy-select-button" />
        );
    };
    const getStandardContent = () => {
        return (
            <HDUpdateButton
                saveValue={saveValue}
                imageSource={standardProduct}
                header={messages.standardHeader}
                list={[
                    messages.commonListItem1,
                    messages.commonListItem2,
                    messages.commonListItem3,
                    messages.standardListItem
                ]}
                id="hd-create-policy-select-button" />
        );
    };
    const availableValues = [
        {
            name: messages.online,
            value: messages.online,
            content: getOnlineContent()
        },
        {
            name: messages.standard,
            value: messages.standard,
            content: getStandardContent()
        },

    ];

    const onBeforeClose = () => {
        trackEvent({
            event_value: 'Overlay closed',
            event_action: `${messages.customizeQuotePolicySupp}`,
            event_type: 'link',
            element_id: 'info-overlay',
        });
    };

    const onClickInfoIcon = () => {
        trackEvent({
            event_value: `${messages.eventValOnlineInfo}`,
            event_action: `${messages.customizeQuotePolicySupp}`,
            event_type: 'link',
            element_id: 'info_circle',
        });
    }

    const infoOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.overlayClosed}` }}
            webAnalyticsEvent={{ event_action: `${messages.overlayClosed}` }}
            id="info-overlay"
            labelText="Online insurance"
            onBeforeClose={onBeforeClose}
            overlayButtonIcon={canShow() && <img src={infoCircleBlue} alt="info_circle" onClick={onClickInfoIcon} />}
        >
            <p>
                Online insurance is a lower cost, self-service policy that you manage yourself in the app and MyAccount.
                You&apos;ll have 24/7 access to your details so you can make changes at a time that suits you, all without having to call.
            </p>
            <p>
                Of course, there are certain things you&apos;ll need to call us about (such as to discuss a claim)
                but call centre support is limited and this saving is reflected in the price of the policy.
            </p>

            <h5>What elements of my policy do I manage online?</h5>

            <p>Although you can still call us for a few specific things, you&apos;ll be expected to manage most parts of your policy online. This includes:</p>
            <ul className="list-tick">
                <li>Changing your car of editing the details</li>
                <li>Adding or removing drivers</li>
                <li>Updating personal info, like your address</li>
                <li>Managing your payments</li>
                <li>Registering or tracking a car claim</li>
            </ul>
            <p>
                If you&apos;d prefer the option to call us to do these types of things,
                you&apos;ll need to switch to a standard policy. It has the same features as online policy but also includes full support from our call centre.
            </p>

            <h5>Is there a difference in price?</h5>

            <p>
                Yes, online policies are cheaper because there&apos;s limited call centre support,
                All fees, such as to change or cancel your policy, are the same as a standard policy.
            </p>

            <h5>Can I still call you if I need help?</h5>

            <p>As you can do most things online, you shouldn&apos;t need to phone us. However, you can call if you need to:</p>
            <ul className="list-tick">
                <li>Discuss your claim in more detail</li>
                <li>Claim one one of your optional extras</li>
                <li>Renew or cancel your policy</li>
            </ul>
            <p>There may also be times when we need to speak to you, so we may ask you to call us for a specific reason.</p>
        </HDOverlayPopup>
    );

    return (
        <Container className={`hd-create-policy-select__container${(className) ? ` ${className}` : ''}`}>
            <Row>
                <Col {...colProps}>
                    <HDLabelRefactor
                        Tag="h2"
                        className="hd-create-policy-select__header-label"
                        icon={infoOverlay}
                        iconPosition="r"
                        text={messages.mainHeader} />
                    {
                        canShow() && !canHideOnlineInfo && (
                            <HDLabelRefactor Tag="p" className="hd-create-policy-select__text-label" text={messages.componentText} />
                        )
                    }
                    <HDToggleButtonGroupRefactor
                        className="hd-create-policy-select__toggle-button"
                        availableValues={availableValues}
                        value={selectedOption}
                        onChange={onChange} />
                    <HDQuoteInfoRefactor className="hd-create-policy-select__quote-info">
                        {messages.infoBoxText}
                    </HDQuoteInfoRefactor>
                    <HDLabelRefactor Tag="p" className="hd-create-policy-select__text-astrisk text-small" text={messages.astrisk} />
                </Col>
            </Row>
        </Container>
    );
};

HDCreatePolicySelect.defaultProps = {
    className: null,
    colProps: null,
    selectedOption: null,
    saveValue: null,
    pageMetadata: null,
    canHideOnlineInfo: false,
};

HDCreatePolicySelect.propTypes = {
    className: PropTypes.string,
    colProps: PropTypes.shape(Col.PropTypes),
    selectedOption: PropTypes.string,
    saveValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({}),
    canHideOnlineInfo: PropTypes.bool
};

HDCreatePolicySelect.typeName = 'HDCreatePolicySelect';

export default HDCreatePolicySelect;
