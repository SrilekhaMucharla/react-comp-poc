/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';

import { Container, Col, Row } from 'react-bootstrap';
import {
    AnalyticsHDModal as HDModal,
    AnalyticsHDButton as HDButton
} from '../../../web-analytics/index';
import HDPrimerYouDriveOverlay from './HDPrimerYouDriveOverlay';
import mobileIcon from '../../../assets/images/icons/static-youdrive-journey-phone-001.png';
import carIcon from '../../../assets/images/icons/car-icon.svg';
import wirelessDeviceIcon from '../../../assets/images/icons/wireless-device-icon.svg';
import downloadAppImg from '../../../assets/images/wizard-images/download-app.jpg';
import setupTab from '../../../assets/images/wizard-images/setup-tab.jpg';
import carDrive from '../../../assets/images/wizard-images/car-drive.jpg';
import * as messages from './HDPrimerYouDrivePage.messages';

const HDPrimerYouDrivePage = (props) => {
    const {
        primerYouDriveFlag, pageMetadata
    } = props;
    const [showPopup, setShowPopup] = useState(false);
    const [showPhonesPopup, setShowPhonesPopup] = useState(false);

    // disable parent continue button
    useEffect(() => {
        props.toggleContinueElement(false); // pass false to explicitly make parent continue button invisible
    }, [props]);

    const showModal = () => {
        setShowPopup(true);
    };

    const moveNext = () => {
        primerYouDriveFlag();
    };

    return (
        <Container className="primer-youdrive__container container--anc">
            <Row className="primer-youdrive__primer-wizard-header">
                <Col>
                    <Row className="primer-youdrive__wizard-title">
                        <Col className="px-md-0">
                            <HDLabelRefactor
                                className="mb-5"
                                text={messages.header}
                                Tag="h1" />
                            <HDLabelRefactor
                                text={messages.subheader}
                                Tag="h1" />
                        </Col>
                    </Row>
                    <Row className="primer-youdrive__primer-wizard-image-container theme-white">
                        <Col xs={12} md={4}>
                            <div className="primer-youdrive__image-container">
                                <img src={mobileIcon} alt="Mobile Icon" className="primer-youdrive__mobile-icon" />
                            </div>
                            <Row className="primer-youdrive__mobile-content">
                                <Col>
                                    <img src={downloadAppImg} alt="download App" className="primer-youdrive__download-app" />
                                </Col>
                            </Row>
                            <Row className="primer-youdrive__mobile-info">
                                <Col>
                                    {messages.mobileInfo}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="primer-youdrive__image-container">
                                <img src={wirelessDeviceIcon} alt="Wireless Icon" className="primer-youdrive__wireless-icon" />
                            </div>
                            <Row className="primer-youdrive__wireless-content">
                                <Col>
                                    <img src={setupTab} alt="setup App" className="primer-youdrive__setup-tab" />
                                </Col>
                            </Row>
                            <Row className="primer-youdrive__setup-info">
                                <Col>
                                    {messages.wirelessInfo}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="primer-youdrive__image-container">
                                <img src={carIcon} alt="Car Icon" className="primer-youdrive__car-icon" />
                            </div>
                            <Row className="primer-youdrive__car-content">
                                <Col>
                                    <img src={carDrive} alt="drive App" className="primer-youdrive__drive" />
                                </Col>
                            </Row>
                            <Row className="primer-youdrive__drive-info">
                                <Col>
                                    {messages.carInfo}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="primer-youdrive__primer-wizard-content">
                <Col>
                    <Row className="point-header">{messages.ydWizardSectionOneHeader}</Row>
                    <Row className="primer-youdrive__point">
                        <Col className="primer-youdrive__dot col-1 px-0" />
                        <Col className="primer-youdrive__point-content px-0">
                            {messages.ydWizardSectionOneBody}
                        </Col>
                    </Row>
                    <Row className="point-header">{messages.ydWizardSectionTwoHeader}</Row>
                    <Row className="primer-youdrive__point">
                        <Col className="primer-youdrive__dot col-1 px-0" />
                        <Col className="primer-youdrive__point-content px-0">
                            {messages.ydWizardSectionTwoBodyOne}
                        </Col>
                    </Row>
                    <Row className="primer-youdrive__point theme-white">
                        <Col className="primer-youdrive__dot col-1 px-0" />
                        <Col className="primer-youdrive__point-content px-0">
                            {messages.ydWizardSectionTwoBodyTwo}
                            <HDLabelRefactor
                                Tag="a"
                                text={messages.ydWizardSectionHereText}
                                onClick={() => setShowPhonesPopup(true)} />
                            .
                        </Col>
                    </Row>
                    <Row className="primer-youdrive__point">
                        <Col className="primer-youdrive__dot col-1 px-0" />
                        <Col className="primer-youdrive__point-content px-0">
                            {messages.ydWizardSectionTwoBodyThree}
                        </Col>
                    </Row>
                    <Row className="point-header">{messages.ydWizardSectionThreeHeader}</Row>
                    <Row className="primer-youdrive__point">
                        <Col className="primer-youdrive__dot col-1 px-0" />
                        <Col className="primer-youdrive__point-content px-0">
                            {messages.ydWizardSectionThreeBody}
                        </Col>
                    </Row>
                    <Row className="point-header">{messages.ydWizardSectionFourHeader}</Row>
                    {
                        messages.ydWizardSectionFourBody.map((data) => {
                            return (
                                <Row className="primer-youdrive__point">
                                    <Col className="primer-youdrive__dot col-1 px-0" />
                                    <Col className="primer-youdrive__point-content px-0">
                                        {data}
                                    </Col>
                                </Row>
                            );
                        })
                    }
                    <Row className="primer-youdrive__primer-wizard-button">
                        <Col xs={12} md={7} className="pl-md-0">
                            <HDButton
                                webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.yesBtnLabel}` }}
                                id="driving-data-button"
                                size="lg"
                                label={messages.yesBtnLabel}
                                className="primer-youdrive__yes-btn theme-white"
                                onClick={() => moveNext()} />
                            <HDModal
                                webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.noModalLabel}` }}
                                webAnalyticsView={{ ...pageMetadata, page_section: `${messages.customizeQuote} - ${messages.noModalLabel}` }}
                                id="youdrive-popup"
                                headerText={messages.noModalLabel}
                                className="primer-youdrive__youdrive-popup-modal"
                                // eslint-disable-next-line react/no-children-prop
                                confirmLabel="Ok, go back"
                                onConfirm={() => setShowPopup(false)}
                                onCancel={() => setShowPopup(false)}
                                onClose={() => setShowPopup(false)}
                                hideCancelButton
                                show={showPopup}
                            >
                                <p>{messages.modalMsgOne}</p>
                            </HDModal>
                        </Col>
                        <Col xs={12} md={5} className="pr-md-0">
                            <HDButton
                                webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.noBtnLabel}` }}
                                id="no-option-button"
                                variant="secondary"
                                size="lg"
                                label={messages.dontWantThisOption}
                                className="primer-youdrive__no-btn theme-white"
                                onClick={showModal} />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <HDModal
                webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.phonesOverlayHeader}` }}
                webAnalyticsView={{ ...pageMetadata, page_section: `${messages.customizeQuote} - ${messages.phonesOverlayHeader}` }}
                id="youdrive-popup"
                show={showPhonesPopup}
                headerText={messages.phonesOverlayHeader}
                customStyle={messages.wide}
                hideConfirmButton
                hideCancelButton
                onCancel={() => setShowPhonesPopup(false)}
                onClose={() => setShowPhonesPopup(false)}
            >
                <HDPrimerYouDriveOverlay />
            </HDModal>
        </Container>
    );
};

HDPrimerYouDrivePage.propTypes = {
    toggleContinueElement: PropTypes.func,
    primerYouDriveFlag: PropTypes.func,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
};

HDPrimerYouDrivePage.defaultProps = {
    toggleContinueElement: () => { },
    primerYouDriveFlag: () => { },
};

export default HDPrimerYouDrivePage;
