import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import rightIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Tick.svg';
import * as messages from './HDPrimerYouDriveOverlay.messages';

const HDPrimerYouDriveOverlay = () => {
    return (
        <Container fluid>
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="primer-overlay__overlay-subheader"
                                text={messages.subheader}
                                Tag="p" />
                        </Col>
                    </Row>
                    <Row className="ml-2 ml-md-0">
                        <Col className="pl-md-0">
                            <Row>
                                <Col>
                                    <HDLabelRefactor
                                        className="primer-overlay__overlay-ios"
                                        text={messages.iosHeader}
                                        Tag="h6" />
                                </Col>
                            </Row>
                            <Row className="primer-overlay__ios-info align-items-center">
                                <Col className="col-auto pr-0 d-flex">
                                    <img src={rightIcon} alt="iOS/iPhone" className="primer-overlay__ios" />
                                </Col>
                                <Col className="pl-0">
                                    {messages.iosSubHeader}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="ml-2 ml-md-0">
                        <Col className="pl-md-0">
                            <Row>
                                <Col>
                                    <HDLabelRefactor
                                        className="primer-overlay__overlay-android"
                                        text={messages.androidReq}
                                        Tag="h6" />
                                </Col>
                            </Row>
                            <Row className="primer-overlay__android-info align-items-center">
                                <Col className="col-auto pr-0 d-flex">
                                    <img src={rightIcon} alt="iOS/iPhone" className="primer-overlay__android" />
                                </Col>
                                <Col className="pl-0">
                                    {messages.androidVersion}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="primer-overlay__overlay-incampatible">
                        <Col>
                            <HDLabelRefactor
                                text={messages.inCampatible}
                                Tag="p" />
                        </Col>
                    </Row>
                    <Row className="primer-overlay__os ml-2 ml-md-0">
                        <Col className="primer-overlay__cross-tick col-auto pr-0 pl-md-0">
                            <i className="fa fa-times-circle" aria-hidden="true" />
                        </Col>
                        <Col className="pl-1">
                            {messages.iosVersion}
                        </Col>
                    </Row>
                    <Row className="primer-overlay__os ml-2 ml-md-0">
                        <Col className="primer-overlay__cross-tick col-auto pr-0 pl-md-0">
                            <i className="fa fa-times-circle" aria-hidden="true" />
                        </Col>
                        <Col className="pl-1">
                            {messages.androidlower}
                        </Col>
                    </Row>
                    <Row className="primer-overlay__os ml-2 ml-md-0">
                        <Col className="primer-overlay__cross-tick col-auto pr-0 pl-md-0">
                            <i className="fa fa-times-circle" aria-hidden="true" />
                        </Col>
                        <Col className="pl-1">
                            {messages.andriodNoPlayStore}
                        </Col>
                    </Row>
                    <Row className="primer-overlay__os ml-2 ml-md-0">
                        <Col className="primer-overlay__cross-tick col-auto pr-0 pl-md-0">
                            <i className="fa fa-times-circle" aria-hidden="true" />
                        </Col>
                        <Col className="pl-1">
                            {messages.phoneRooted}
                        </Col>
                    </Row>
                    <Row className="primer-overlay__os ml-2 ml-md-0 mt-2">
                        <Col className="primer-overlay__cross-tick col-auto pr-0 pl-md-0">
                            <i className="fa fa-times-circle" aria-hidden="true" />
                        </Col>
                        <Col className="pl-1">
                            <b>{messages.samsung}</b>
                            {messages.galaxy}
                        </Col>
                    </Row>
                    <Row className="primer-overlay__os ml-2 ml-md-0">
                        <Col className="primer-overlay__cross-tick col-auto pr-0 pl-md-0">
                            <i className="fa fa-times-circle" aria-hidden="true" />
                        </Col>
                        <Col className="pl-1">
                            <b>{messages.htc}</b>
                            {messages.htcver}
                        </Col>
                    </Row>
                    <Row className="primer-overlay__os ml-2 ml-md-0">
                        <Col className="primer-overlay__cross-tick col-auto pr-0 pl-md-0">
                            <i className="fa fa-times-circle" aria-hidden="true" />
                        </Col>
                        <Col className="pl-1">
                            <b>{messages.hauwei}</b>
                            {messages.hauweiVer}
                        </Col>
                    </Row>
                    <Row className="primer-overlay__os ml-2 ml-md-0">
                        <Col className="primer-overlay__cross-tick col-auto pr-0 pl-md-0">
                            <i className="fa fa-times-circle" aria-hidden="true" />
                        </Col>
                        <Col className="pl-1">
                            <b>{messages.blu}</b>
                            {messages.bluVer}
                        </Col>
                    </Row>
                    <Row className="primer-overlay__os ml-2 ml-md-0">
                        <Col className="primer-overlay__cross-tick col-auto pr-0 pl-md-0">
                            <i className="fa fa-times-circle" aria-hidden="true" />
                        </Col>
                        <Col className="pl-1">
                            <b>{messages.asus}</b>
                            {messages.asusVer}
                        </Col>
                    </Row>
                    <Row className="primer-overlay__os ml-2 ml-md-0">
                        <Col className="primer-overlay__cross-tick col-auto pr-0 pl-md-0">
                            <i className="fa fa-times-circle" aria-hidden="true" />
                        </Col>
                        <Col className="pl-1">
                            <b>{messages.zte}</b>
                            {messages.zteVer}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default HDPrimerYouDriveOverlay;
