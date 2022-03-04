import React from 'react';
import PropTypes from 'prop-types';
import {
    HDLabelRefactor,
    HDInfoCardRefactor
} from 'hastings-components';
import { Row, Col } from 'react-bootstrap';
import { AnalyticsHDButton as HDButton } from '../../../web-analytics';
import * as messages from './HDMCPNCDPage.messages';
import pncdIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Illustrations_Noclaims.svg';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';


export default function HDHeader({ message, goForward }) {
    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 6, offset: 3 }
    };
    return (
        <Row className="pncd-container padding-bottom-xl pt-4">
            <Col {...mainColProps}>
                <div className="container--anc">
                    <HDLabelRefactor
                        icon={<img src={pncdIcon} alt="PNCD Icon" />}
                        Tag="h2"
                        iconPosition="r"
                        adjustImagePosition={false}
                        text={message}

                        className="pncd__title-label mb-3 mb-lg-0"
                        id="pncd-title-label" />
                    <Row>
                        <Col md={6}>
                            <HDButton
                                webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                                id="continue-button"
                                size="lg"
                                className="pncd__continue-btn w-100 theme-white"
                                label="Continue"
                                onClick={goForward} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <HDInfoCardRefactor
                                id="pncd-not-eligible-info"
                                image={tipCirclePurple}
                                paragraphs={[messages.notEligibleInfo]}
                                theme="light"
                                size="thin"
                                className="mt-3 mt-md-4" />
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
}

HDHeader.propTypes = {
    message: PropTypes.string.isRequired,
    goForward: PropTypes.func.isRequired
};
