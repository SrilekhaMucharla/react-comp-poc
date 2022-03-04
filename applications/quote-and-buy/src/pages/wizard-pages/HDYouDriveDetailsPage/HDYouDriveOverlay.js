import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import PropTypes from 'prop-types';
import { AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../../web-analytics/index';
import HastingsYouDrive from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-youdrive.svg';
import Tick from '../../../assets/images/icons/tick-icon.svg';
import mobileNavigation from '../../../assets/images/icons/static-youdrive-journey-phone-001.png';
import keyImage from '../../../assets/images/wizard-images/static-youdrive-tab-keyfob-001.png';
import redCarImage from '../../../assets/images/wizard-images/static-red-car-001.png';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import circleNumberOne from '../../../assets/images/wizard-images/circle-number-1.svg';
import circleNumberTwo from '../../../assets/images/wizard-images/circle-number-2.svg';
import circleNumberThree from '../../../assets/images/wizard-images/circle-number-3.svg';
import * as messages from './HDYouDriveOverlay.messages';
import { pageMetadataPropTypes } from '../../../constant/propTypes';

const HDYouDriveOverlay = ({ pageMetadata }) => (
    <HDOverlayPopup
        webAnalyticsView={{ ...pageMetadata, page_section: `${messages.customizeQuote} - ${messages.headerMessage}` }}
        webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.headerMessage}` }}
        id="you-drive-overlay"
        overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
    >
        <Row className="you-drive-overlay">
            <Col>
                <Row>
                    <Col>
                        <img className="you-drive-overlay__you-drive-icon" src={HastingsYouDrive} alt="" />
                    </Col>
                </Row>
                <Row className="you-drive-overlay__overlay-header mb-4">
                    <Col className="px-0">
                        <HDLabelRefactor
                            className="you-drive-overlay__header-label"
                            Tag="h2"
                            size="lg"
                            text={messages.headerMessage} />
                    </Col>
                </Row>
                <Row className="you-drive-overlay__overlay-message">
                    <Col>
                        <HDLabelRefactor
                            Tag="span"
                            size="xs"
                            text={messages.overlayInfoOneMesage} />
                    </Col>
                </Row>
                <Row className="you-drive-overlay__overlay-list">
                    <Col>
                        <Row className="you-drive-overlay__paragraph-header mb-2">
                            <Col>
                                <HDLabelRefactor
                                    className="you-drive-overlay__label"
                                    Tag="h5"
                                    size="md"
                                    text={messages.benefitsOneHeader}
                                    icon={<img className="you-drive-overlay__paragraph-tick" src={Tick} alt="tick" />}
                                    iconPosition="l" />
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__overlay-message mb-3">
                            <Col>
                                <HDLabelRefactor className="dash-icon" Tag="span" size="xs" text="-" />
                                <HDLabelRefactor Tag="span" size="xs" text={messages.benefitOneMessageOne} />
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__overlay-message mb-3">
                            <Col>
                                <HDLabelRefactor className="dash-icon" Tag="span" size="xs" text="-" />
                                <HDLabelRefactor Tag="span" size="xs" text={messages.benefitOneMessageTwo} />
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__overlay-message mb-3">
                            <Col>
                                <HDLabelRefactor className="dash-icon" Tag="span" size="xs" text="-" />
                                <HDLabelRefactor Tag="span" size="xs" text={messages.benefitOneMessageThree} />
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__paragraph-header mb-2">
                            <Col>
                                <HDLabelRefactor
                                    className="you-drive-overlay__label"
                                    Tag="h5"
                                    size="md"
                                    text={messages.benefitsTwoHeader}
                                    icon={<img className="you-drive-overlay__paragraph-tick" src={Tick} alt="tick" />}
                                    iconPosition="l" />
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__overlay-message mb-3">
                            <Col>
                                <HDLabelRefactor className="dash-icon" Tag="span" size="xs" text="-" />
                                <HDLabelRefactor Tag="span" size="xs" text={messages.benefitTwoMessageOne} />
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__overlay-message mb-3">
                            <Col>
                                <HDLabelRefactor className="dash-icon" Tag="span" size="xs" text="-" />
                                <HDLabelRefactor Tag="span" size="xs" text={messages.benefitTwoMessageTwo} />
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__paragraph-header mb-2">
                            <Col>
                                <HDLabelRefactor
                                    className="you-drive-overlay__label"
                                    Tag="h5"
                                    size="md"
                                    text={messages.benefitsThreeHeader}
                                    icon={<img className="you-drive-overlay__paragraph-tick" src={Tick} alt="tick" />}
                                    iconPosition="l" />
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__overlay-message mb-3">
                            <Col>
                                <HDLabelRefactor className="dash-icon" Tag="span" size="xs" text="-" />
                                <HDLabelRefactor Tag="span" size="xs" text={messages.benefitThreeMessageOne} />
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__overlay-message mb-3">
                            <Col>
                                <HDLabelRefactor className="dash-icon" Tag="span" size="xs" text="-" />
                                <HDLabelRefactor Tag="span" size="xs" text={messages.benefitThreeMessageTwo} />
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__overlay-message mb-3">
                            <Col>
                                <HDLabelRefactor className="dash-icon" Tag="span" size="xs" text="-" />
                                <HDLabelRefactor Tag="span" size="xs" text={messages.benefitThreeMessageThree} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="you-drive-overlay__overlay-sub-header">
                    <Col>
                        <HDLabelRefactor
                            Tag="h5"
                            size="md"
                            text={messages.overlayInfoTwoHeader} />
                    </Col>
                </Row>
                <Row className="you-drive-overlay__you-drive-steps">
                    <Col>
                        <Row className="you-drive-overlay__you-drive-app you-drive-step">
                            <Col className="you-drive-overlay__steps-image col-4 mb-auto">
                                <img className="you-drive-overlay__app-image" src={mobileNavigation} alt="" />
                            </Col>
                            <Col>
                                <Row className="you-drive-overlay__app-header you-drive-overlay__steps-header mb-3">
                                    <Col className="col-1 align-content-center d-flex">
                                        <img className="you-drive-overlay__number-image" src={circleNumberOne} alt="" />
                                    </Col>
                                    <Col>
                                        <HDLabelRefactor
                                            className="you-drive-overlay__steps-label my-0"
                                            Tag="h5"
                                            size="md"
                                            text={messages.appHeader} />
                                    </Col>
                                </Row>
                                <Row className="you-drive-overlay__app-message you-drive-overlay__steps-message">
                                    <Col>
                                        <HDLabelRefactor
                                            Tag="p"
                                            size="xs"
                                            text={messages.appMessage} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__you-drive-key you-drive-overlay__you-drive-step">
                            <Col className="you-drive-overlay__steps-image col-4 mt-3 mb-auto">
                                <img className="you-drive-overlay__key-image" src={keyImage} alt="" />
                            </Col>
                            <Col>
                                <Row className="you-drive-overlay__key-header you-drive-overlay__steps-header mb-3">
                                    <Col className="col-1">
                                        <img className="you-drive-overlay__number-image" src={circleNumberTwo} alt="" />
                                    </Col>
                                    <Col>
                                        <HDLabelRefactor
                                            className="you-drive-overlay__steps-label my-0"
                                            Tag="h5"
                                            size="md"
                                            text={messages.keyHeader} />
                                    </Col>
                                </Row>
                                <Row className="you-drive-overlay__key-message you-drive-overlay__steps-message">
                                    <Col>
                                        <HDLabelRefactor
                                            Tag="p"
                                            size="xs"
                                            text={messages.keyMessage} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="you-drive-overlay__you-drive-car you-drive-overlay__you-drive-step">
                            <Col className="you-drive-overlay__steps-image col-4 mt-3 mb-auto">
                                <img className="you-drive-overlay__car-image" src={redCarImage} alt="" />
                            </Col>
                            <Col>
                                <Row className="you-drive-overlay__car-header you-drive-overlay__steps-header mb-3">
                                    <Col className="col-1">
                                        <img className="you-drive-overlay__number-image" src={circleNumberThree} alt="" />
                                    </Col>
                                    <Col>
                                        <HDLabelRefactor
                                            className="you-drive-overlay__steps-label my-0"
                                            Tag="h5"
                                            size="md"
                                            text={messages.carHeader} />
                                    </Col>
                                </Row>
                                <Row className="you-drive-overlay__car-message you-drive-overlay__steps-message">
                                    <Col>
                                        <HDLabelRefactor
                                            Tag="p"
                                            size="xs"
                                            text={messages.carMessage} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    </HDOverlayPopup>
);

HDYouDriveOverlay.propTypes = {
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired
};
export default HDYouDriveOverlay;
