import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import {
    AnalyticsHDButtonDashed as HDButtonDashed,
} from '../../web-analytics';
import mcCarImageMobile from '../../assets/images/background/rectangle-2830.png';
import * as messages from './HDAddAnotherCar.messages';

const HDAddAnotherCar = ({ hidden, addCarHandler }) => {
    return (
        <div hidden={hidden}>
            <Row className="add-car__card ml-1 mr-1">
                <Col>
                    <Row className="add-car__mc-image mb-1 pl-0 pr-0">
                        <Col className="pr-0 pl-0">
                            <img src={mcCarImageMobile} alt="Multi Car Img" className="add-car__mc-image-mob" />
                        </Col>
                    </Row>
                    <Row className="add-car__header mb-3">
                        <Col>
                            <HDLabelRefactor
                                text={messages.multiCarHeader}
                                Tag="h6" />
                        </Col>
                    </Row>
                    <Row className="add-car__mc-points mb-4">
                        <Col>
                            <ul>
                                <li>
                                    <HDLabelRefactor
                                        className="add-car__mc-points__mc1"
                                        text={messages.mcMessageOne}
                                        Tag="p" />
                                </li>
                                <li>
                                    <HDLabelRefactor
                                        className="add-car__mc-points__mc2"
                                        text={messages.mcMessageTwo}
                                        Tag="p" />
                                </li>
                                <li>
                                    <HDLabelRefactor
                                        className="add-car__mc-points__mc3"
                                        text={messages.mcMessageThree}
                                        Tag="p" />
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="add-car__add-button mt-4">
                <Col>
                    <HDButtonDashed
                        webAnalyticsEvent={{ event_action: messages.addAnotherCar }}
                        id="add=another-car-button"
                        className="add-car__another-driver-button"
                        label={messages.addAnotherCar}
                        icon
                        onClick={addCarHandler} />
                </Col>
            </Row>
        </div>
    );
};

HDAddAnotherCar.propTypes = {
    hidden: PropTypes.bool,
    addCarHandler: PropTypes.func
};

HDAddAnotherCar.defaultProps = {
    hidden: true,
    addCarHandler: null
};

export default HDAddAnotherCar;
