import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import {
    HDLabelRefactor
} from 'hastings-components';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDButton as HDButton
} from '../../../web-analytics';
import * as messages from './HDPNCDPage.messages';
import pncdIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Illustrations_Noclaims.svg';

const HDPNCDCostQuestionPage = ({ displayNCDCostPage, ncdAvailedValue, triggerNextRoute }) => {
    const [displayCostToggle, setDisplayCostToggle] = useState('no');
    const availableValues = [{
        value: 'yes',
        name: messages.yes,
    }, {
        value: 'no',
        name: messages.no,
    }];

    const handleCostQuestion = (event) => {
        setDisplayCostToggle(event.target.value);
    };

    const handleContinueTriggerButton = () => {
        if (displayCostToggle === 'yes') {
            displayNCDCostPage();
        } else {
            triggerNextRoute();
        }
    };
    useEffect(() => {
        if (ncdAvailedValue === null) {
            setDisplayCostToggle('');
        }
    }, []);

    return (
        <div className="container--anc">
            <HDLabelRefactor
                icon={<img src={pncdIcon} alt="PNCD Icon" />}
                Tag="h2"
                iconPosition="r"
                adjustImagePosition={false}
                text={messages.ncdProtectionHeader}
                className="pncd__title-label mb-3"
                id="pncd-title-label" />

            <HDToggleButtonGroup
                webAnalyticsEvent={{ event_action: messages.ancillariesNCD }}
                availableValues={availableValues}
                label={{
                    Tag: 'h3',
                    text: messages.ncdProtectionQuestion,
                    className: 'pncd__cost-question-label'
                }}
                value={displayCostToggle}
                onChange={(e) => handleCostQuestion(e)}
                btnGroupClassName="grid grid--col-2 grid--col-md-3 gap-md"
                btnClassName="theme-white" />
            {displayCostToggle !== null && (
                <Row>
                    <Col md={6}>
                        <HDButton
                            webAnalyticsEvent={{ event_action: messages.ancillariesNCD }}
                            id="continue-button"
                            className="pncd__continue-btn w-100 theme-white"
                            size="lg"
                            label={messages.continueMessage}
                            onClick={handleContinueTriggerButton} />
                    </Col>

                </Row>
            )}
        </div>
    );
};

HDPNCDCostQuestionPage.propTypes = {

    displayNCDCostPage: PropTypes.func,
    triggerNextRoute: PropTypes.func,
    ncdAvailedValue: PropTypes.string
};

HDPNCDCostQuestionPage.defaultProps = {

    displayNCDCostPage: () => {},
    triggerNextRoute: PropTypes.func,
    ncdAvailedValue: null
};

export default HDPNCDCostQuestionPage;
