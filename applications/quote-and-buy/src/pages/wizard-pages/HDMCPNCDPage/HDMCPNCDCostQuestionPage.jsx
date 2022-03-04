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
import * as messages from './HDMCPNCDPage.messages';
import pncdIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Illustrations_Noclaims.svg';

const HDMCPNCDCostQuestionPage = ({ displayNCDCostPage, ncdAvailedValue, onContinueHandler, vehicleName }) => {
    const [displayCostToggle, setDisplayCostToggle] = useState('no');
    const availableValues = [{
        value: 'yes',
        name: messages.yes,
    }, {
        value: 'no',
        name: messages.no,
    }];

    const onButtonChangeHandler = (event) => {
        if (event.target.value === 'yes') {
            setDisplayCostToggle(event.target.value);
            displayNCDCostPage(event);
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
                text={messages.pageTitle(vehicleName)}
                className="pncd__title-label mb-3"
                id="pncd-title-label" />

            <HDToggleButtonGroup
                webAnalyticsEvent={{ event_action: `${messages.ancillariesNCD} - ${messages.ncdProtectionQuestionEventLabel}` }}
                id="mc-pncd-find-out-button-group"
                availableValues={availableValues}
                label={{
                    Tag: 'h3',
                    text: messages.ncdProtectionQuestion,
                    className: 'pncd__cost-question-label'
                }}
                value={displayCostToggle}
                onChange={(e) => onButtonChangeHandler(e)}
                btnGroupClassName="grid grid--col-2 grid--col-md-3 gap-md"
                btnClassName="theme-white" />
            {displayCostToggle !== null && (
                <Row>
                    <Col md={6}>
                        <HDButton
                            webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                            id="continue-button"
                            className="pncd__continue-btn w-100 theme-white"
                            size="lg"
                            label="Continue"
                            onClick={onContinueHandler} />
                    </Col>

                </Row>
            )}
        </div>
    );
};

HDMCPNCDCostQuestionPage.propTypes = {

    displayNCDCostPage: PropTypes.func,
    onContinueHandler: PropTypes.func,
    ncdAvailedValue: PropTypes.string,
    vehicleName: PropTypes.string.isRequired
};

HDMCPNCDCostQuestionPage.defaultProps = {

    displayNCDCostPage: () => {},
    onContinueHandler: PropTypes.func,
    ncdAvailedValue: null
};

export default HDMCPNCDCostQuestionPage;
