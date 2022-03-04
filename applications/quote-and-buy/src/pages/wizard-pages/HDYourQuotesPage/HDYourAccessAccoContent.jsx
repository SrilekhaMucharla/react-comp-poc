import { Col, Row } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import React from 'react';
import * as messages from './HDYourAccessAccoContent.messages';

const HDYourAccessAccoContent = () => (
    <Row className="your-excess-acco__content">
        <Col>
            <Row>
                <Col>
                    <HDLabelRefactor
                        className="margin-bottom-md"
                        text={messages.overlayHeaderOne}
                        Tag="h3" />
                </Col>
            </Row>
            <Row className="your-excess-acco__description">
                <Col>
                    <HDLabelRefactor text={messages.overlayBodyOne} Tag="p" />
                    <HDLabelRefactor text={messages.overlayBodyTwo} Tag="p" />
                    <HDLabelRefactor text={messages.overlayBodyThree} Tag="p" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <HDLabelRefactor
                        className="your-excess-acco__header"
                        text={messages.overlayHeaderTwo}
                        Tag="h3" />
                </Col>
            </Row>
            <Row className="your-excess-acco__description">
                <Col>
                    <HDLabelRefactor text={messages.overlayBodyVoluntaryExcess} Tag="p" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <HDLabelRefactor
                        className="your-excess-acco__header"
                        text={messages.overlayHeaderThree}
                        Tag="h3" />
                </Col>
            </Row>
            <Row className="your-excess-acco__description">
                <Col>
                    <HDLabelRefactor text={messages.overBodyCompulsoryExcess} Tag="p" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <HDLabelRefactor
                        className="your-excess-acco__header"
                        text={messages.overlayHeaderFour}
                        Tag="h3" />
                </Col>
            </Row>
            <Row className="your-excess-acco__description">
                <Col>
                    <HDLabelRefactor text={messages.overBodyDesc} Tag="p" />
                </Col>
            </Row>
        </Col>
    </Row>
);

export default HDYourAccessAccoContent;
