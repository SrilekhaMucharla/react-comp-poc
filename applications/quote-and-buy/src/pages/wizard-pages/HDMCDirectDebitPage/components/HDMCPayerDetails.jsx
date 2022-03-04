import React, { useState, useContext, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import {
    HDInfoCardRefactor, HDLabelRefactor,
} from 'hastings-components';
import PropTypes from 'prop-types';
import {
    AnalyticsHDModal as HDModal,
    AnalyticsHDTextInput as HDTextInput
} from '../../../../web-analytics';
import { TranslatorContext } from '../../../../integration/TranslatorContext';
import exclamation from '../../../../assets/images/icons/exclamation-icon.svg';
import messages from './HDMCPayerDetails.messages';
import directDebitLogo from '../../../../assets/images/icons/logo-direct-debit-black.svg';
import { mcSubmissionPropTypes, pageMetadataPropTypes } from '../../../../constant/propTypes';

const HDMCPayerDetails = ({ mcsubmissionVM, pageMetadata }) => {
    const translator = useContext(TranslatorContext);
    const [accountHolderPrefix, setAccountHolderPrefix] = useState(undefined);
    const [showDirectDebitOverlay, setShowDirectDebitOverlay] = useState(false);
    const fallbackPrefix = 'Mr';
    const prefixCodes = ['003_Mr', '004', '005_Ms', '002'];

    const displayDirectDebitOverlay = () => {
        setShowDirectDebitOverlay(true);
    };

    const closeDirectDebitOverlay = () => {
        setShowDirectDebitOverlay(false);
    };

    const getAvailableValues = (aspectPrefixes, prefixCodeArray) => prefixCodeArray.map((code) => {
        const singlePrefix = aspectPrefixes.find((element) => code === element.code);
        return {
            code: singlePrefix.code,
            name: translator({
                id: singlePrefix.name,
                defaultMessage: singlePrefix.name
            })
        };
    });

    useEffect(() => {
        // eslint-disable-next-line no-underscore-dangle
        const prefixAvailableArray = mcsubmissionVM.accountHolder.prefix._aspects.availableValues;
        const parsedPrefixsesArray = getAvailableValues(prefixAvailableArray, prefixCodes);
        const selectedPrefix = parsedPrefixsesArray.filter((p) => p.code === mcsubmissionVM.value.accountHolder.prefix)[0];
        setAccountHolderPrefix(selectedPrefix.name || fallbackPrefix);
    }, []);

    return (
        <Row className="mc-account-holder theme-white mt-3">
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
                                    className="account-holder-details__link decorated-blue-line decorated-blue-line--on-white p-0"
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
                <Row>
                    <Col xs={12} className="direct-debit-simple-mint-box">
                        <HDInfoCardRefactor theme="mint" paragraphs={[messages.mintBoxAccountDetailsText]} image={exclamation} />
                    </Col>
                </Row>
                <HDModal
                    webAnalyticsEvent={{ event_action: messages.directDebitHeader }}
                    webAnalyticsView={{ ...pageMetadata, page_section: messages.directDebitHeader }}
                    id="mc-account-holder-modal direct-debit-modal"
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
                <Row>
                    <Col xs={12} lg={9} className="pr-lg-5">
                        {accountHolderPrefix && (
                            <>
                                <Row className="account-holder-details__Lable-text">
                                    <Col>
                                        <HDLabelRefactor
                                            className="account-holder-details__personal-detail-container__label my-3"
                                            Tag="h5"
                                            text={messages.title} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <HDTextInput
                                            disabled
                                            className="account-holder-details__personal-detail-container__input input-group--on-white"
                                            webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.firstName }}
                                            id="title-name-input"
                                            data={accountHolderPrefix}
                                            path="payerDetails.prefix"
                                            name="prefix" />
                                    </Col>
                                </Row>
                            </>
                        )}
                        <Row className="account-holder-details__Lable-text">
                            <Col>
                                <HDLabelRefactor
                                    className="account-holder-details__personal-detail-container__label my-3"
                                    Tag="h5"
                                    text={messages.firstName} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HDTextInput
                                    disabled
                                    className="account-holder-details__personal-detail-container__input input-group--on-white"
                                    webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.firstName }}
                                    id="first-name-input"
                                    data={mcsubmissionVM.value.accountHolder.firstName}
                                    path="payerDetails.firstName"
                                    name="firstName" />
                            </Col>
                        </Row>
                        <Row className="account-holder-details__Lable-text">
                            <Col>
                                <HDLabelRefactor
                                    className="account-holder-details__personal-detail-container__label my-3"
                                    Tag="h5"
                                    text={messages.lastName} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HDTextInput
                                    disabled
                                    className="account-holder-details__personal-detail-container__input input-group--on-white"
                                    webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.firstName }}
                                    id="last-name-input"
                                    data={mcsubmissionVM.value.accountHolder.lastName}
                                    path="payerDetails.lastName"
                                    name="lastName" />
                            </Col>
                        </Row>
                        <Row className="account-holder-details__Lable-text">
                            <Col>
                                <HDLabelRefactor
                                    className="account-holder-details__personal-detail-container__label my-3"
                                    Tag="h5"
                                    text={messages.postcode} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HDTextInput
                                    disabled
                                    className="account-holder-details__personal-detail-container__input input-group--on-white"
                                    webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.firstName }}
                                    id="postalCode-input"
                                    data={mcsubmissionVM.value.accountHolder.primaryAddress.postalCode}
                                    name="postalCode" />
                            </Col>
                        </Row>
                        <Row className="account-holder-details__Lable-text">
                            <Col>
                                <HDLabelRefactor
                                    className="account-holder-details__personal-detail-container__label my-3"
                                    Tag="h5"
                                    text={messages.firstLineOfAddress} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HDTextInput
                                    disabled
                                    className="account-holder-details__personal-detail-container__input input-group--on-white"
                                    webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.firstName }}
                                    id="first-line-adress-input"
                                    data={mcsubmissionVM.value.accountHolder.primaryAddress.addressLine1}
                                    name="firstLineAdress" />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

HDMCPayerDetails.propTypes = {
    mcsubmissionVM: PropTypes.shape(mcSubmissionPropTypes).isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
};

export default HDMCPayerDetails;
