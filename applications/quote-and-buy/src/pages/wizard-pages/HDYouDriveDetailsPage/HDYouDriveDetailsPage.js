import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {
    HDLabelRefactor
} from 'hastings-components';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tick from '../../../assets/images/icons/tick-icon.svg';
import watchingMobile from '../../../assets/images/wizard-images/static-youdrive-phone-sea-001.jpg';
import mobileNavigation from '../../../assets/images/icons/static-youdrive-journey-phone-001.png';
import keyImage from '../../../assets/images/wizard-images/static-youdrive-tab-keyfob-001.png';
import redCarImage from '../../../assets/images/wizard-images/static-red-car-001.png';
import circleNumberOne from '../../../assets/images/wizard-images/circle-number-1.svg';
import circleNumberTwo from '../../../assets/images/wizard-images/circle-number-2.svg';
import circleNumberThree from '../../../assets/images/wizard-images/circle-number-3.svg';
import * as messages from './HDYouDriveDetailsPage.messages';
// import './HDYouDriveDetailsPage.scss';
import HDYouDriveOverlay from './HDYouDriveOverlay';
import { pageMetadataPropTypes } from '../../../constant/propTypes';


export const HDYouDriveDetailsPage = ({ pageMetadata }) => {
    return (
        <Row className="you-drive-cover-details">
            <Col>
                <Row className="you-drive-cover-details__container text-left">
                    <Col className="you-drive-cover-details__benefits-messages">
                        <Row className="you-drive-cover-details__benefits-header mb-3">
                            <Col>
                                <HDLabelRefactor
                                    className="you-drive-cover-details__benefits-header-label"
                                    Tag="h5"
                                    size="md"
                                    text={messages.headerMessage} />
                            </Col>
                            <Col className="text-left px-0 col-2">
                                <HDYouDriveOverlay pageMetadata={pageMetadata} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HDLabelRefactor
                                    className="you-drive-cover-details__benefits-header-info"
                                    Tag="p"
                                    text={messages.messageText} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HDLabelRefactor
                                    Tag="h5"
                                    text={messages.benefitOne}
                                    icon={<img src={Tick} alt="tick" />}
                                    iconPosition="l" />
                                <Row>
                                    <Col className="you-drive-cover-details__benefits-list-point">
                                        <HDLabelRefactor className="you-drive-cover-details__benefits-dash mb-1" Tag="p" text="-" />
                                        <HDLabelRefactor
                                            className="you-drive-cover-details__benefits-message mb-1"
                                            Tag="p"
                                            text={messages.benefitOneMessageOne} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="you-drive-cover-details__benefits-list-point">
                                        <HDLabelRefactor className="you-drive-cover-details__benefits-dash mb-1" Tag="p" text="-" />
                                        <HDLabelRefactor
                                            className="you-drive-cover-details__benefits-message mb-1"
                                            Tag="p"
                                            text={messages.benefitOneMessageTwo} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="you-drive-cover-details__benefits-list-point">
                                        <HDLabelRefactor className="you-drive-cover-details__benefits-dash" Tag="p" text="-" />
                                        <HDLabelRefactor className="you-drive-cover-details__benefits-message" Tag="p" text={messages.benefitOneMessageThree} />
                                    </Col>
                                </Row>
                                <HDLabelRefactor
                                    Tag="h5"
                                    size="md"
                                    text={messages.benefitTwo}
                                    icon={<img src={Tick} alt="tick" />}
                                    iconPosition="l" />
                                <Row>
                                    <Col className="you-drive-cover-details__benefits-list-point">
                                        <HDLabelRefactor className="you-drive-cover-details__benefits-dash mb-1" Tag="p" text="-" />
                                        <HDLabelRefactor
                                            className="you-drive-cover-details__benefits-message mb-1"
                                            Tag="p"
                                            text={messages.benefitTwoMessageOne} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="you-drive-cover-details__benefits-list-point">
                                        <HDLabelRefactor className="you-drive-cover-details__benefits-dash" Tag="p" text="-" />
                                        <HDLabelRefactor className="you-drive-cover-details__benefits-message" Tag="p" text={messages.benefitTwoMessageTwo} />
                                    </Col>
                                </Row>
                                <HDLabelRefactor
                                    Tag="h5"
                                    size="md"
                                    text={messages.benefitThree}
                                    icon={<img src={Tick} alt="tick" />}
                                    iconPosition="l" />
                                <Row>
                                    <Col className="you-drive-cover-details__benefits-list-point">
                                        <HDLabelRefactor className="you-drive-cover-details__benefits-dash mb-1" Tag="p" text="-" />
                                        <HDLabelRefactor
                                            className="you-drive-cover-details__benefits-message mb-1"
                                            Tag="p"
                                            text={messages.benefitThreeMessageOne} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="you-drive-cover-details__benefits-list-point">
                                        <HDLabelRefactor className="you-drive-cover-details__benefits-dash mb-1" Tag="p" text="-" />
                                        <HDLabelRefactor
                                            className="you-drive-cover-details__benefits-message mb-1"
                                            Tag="p"
                                            text={messages.benefitThreeMessageTwo} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="you-drive-cover-details__benefits-list-point">
                                        <HDLabelRefactor className="you-drive-cover-details__benefits-dash mb-1" Tag="p" text="-" />
                                        <HDLabelRefactor
                                            className="you-drive-cover-details__benefits-message mb-1"
                                            Tag="p"
                                            text={messages.benefitThreeMessageThree} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="you-drive-cover-details__image px-0">
                        <div className="you-drive-cover-details__control-mask">
                            <img className="you-drive-cover-details__image-desktop" src={watchingMobile} alt="" />
                        </div>
                    </Col>
                </Row>
                <Row className="you-drive-cover-details__control-benefits">
                    <Col>
                        <Row className="mt-5">
                            <Col className="text-center">
                                <HDLabelRefactor
                                    className="you-drive-cover-details__control-header"
                                    text={messages.youAteInControl}
                                    Tag="h5" />
                            </Col>
                        </Row>
                        <Row className="mb-5">
                            <Col className="text-center">
                                <HDLabelRefactor
                                    className="you-drive-cover-detail__benefits-subheader"
                                    text={messages.driveStraightAway}
                                    Tag="p" />
                            </Col>
                        </Row>
                        <Row className="d-block d-md-flex">
                            <Col className="you-drive-cover-details__control-app">
                                <Row className="you-drive-cover-details__control-steps-image">
                                    <Col className="text-center">
                                        <img className="you-drive-cover-details__control-app-image" src={mobileNavigation} alt="" />
                                    </Col>
                                </Row>
                                <Row className="you-drive-cover-details__control-app-header justify-content-center justify-content-md-start">
                                    <Col className="col-1 col-md-2">
                                        <img className="you-drive-cover-details__control-number-image" src={circleNumberOne} alt="" />
                                    </Col>
                                    <Col className="col-5 col-md-10">
                                        <HDLabelRefactor
                                            className="text-left"
                                            Tag="h5"
                                            text={messages.appHeader} />
                                    </Col>
                                </Row>
                                <Row className="you-drive-cover-details__control-app-message steps-message mt-2">
                                    <Col>
                                        <HDLabelRefactor
                                            Tag="p"
                                            text={messages.appMessage} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="you-drive-cover-details__control-you-drive-key">
                                <Row className="you-drive-cover-details__control-steps-image">
                                    <Col className="text-center">
                                        <img className="you-drive-cover-details__control-key-image" src={keyImage} alt="" />
                                    </Col>
                                </Row>
                                <Row className="you-drive-cover-details__control-key-header justify-content-center justify-content-md-start">
                                    <Col className="col-1 col-md-2">
                                        <img className="you-drive-cover-details__control-number-image" src={circleNumberTwo} alt="" />
                                    </Col>
                                    <Col className="col-5 col-md-10">
                                        <HDLabelRefactor
                                            className="text-left"
                                            Tag="h5"
                                            text={messages.keyHeader} />
                                    </Col>
                                </Row>
                                <Row className="you-drive-cover-details__control-key-message steps-message mt-2">
                                    <Col>
                                        <HDLabelRefactor
                                            Tag="p"
                                            text={messages.keyMessage} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="you-drive-cover-details__control-you-drive-car">
                                <Row className="you-drive-cover-details__control-steps-image">
                                    <Col className="text-center">
                                        <img className="you-drive-cover-details__control-car-image" src={redCarImage} alt="" />
                                    </Col>
                                </Row>
                                <Row className="you-drive-cover-details__control-car-header justify-content-center justify-content-md-start">
                                    <Col className="col-1 col-md-2">
                                        <img className="you-drive-cover-details__control-number-image" src={circleNumberThree} alt="" />
                                    </Col>
                                    <Col className="col-4 col-md-10">
                                        <HDLabelRefactor
                                            className="text-left"
                                            Tag="h5"
                                            text={messages.carHeader} />
                                    </Col>
                                </Row>
                                <Row className="you-drive-cover-details__control-car-message steps-message mt-2">
                                    <Col>
                                        <HDLabelRefactor
                                            Tag="p"
                                            text={messages.carMessage} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

HDYouDriveDetailsPage.propTypes = {
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired
};

export default withRouter(HDYouDriveDetailsPage);
