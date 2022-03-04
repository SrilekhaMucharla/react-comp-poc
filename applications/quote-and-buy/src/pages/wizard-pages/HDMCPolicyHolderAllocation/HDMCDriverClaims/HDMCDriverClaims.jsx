import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as yup from 'hastings-components/yup';
import { HDForm } from 'hastings-components';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup
} from '../../../../web-analytics';
import { setNavigation as setNavigationAction } from '../../../../redux-thunk/actions';
import * as messages from './HDMCDriverClaims.messages';

const HDMCDriverClaims = ({ submissionVM, setNavigation }) => {
    const availableValues = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];

    useEffect(() => {
        setNavigation({ showForward: false, canForward: false });
    }, []);

    const validationSchema = yup.object({
        // [ownYourHome]: yup.string()
        //     .required(messages.required)
        //     .VMValidation(ownYourHomePath, null, submissionVM),
        // [anyChildrenUnder16]: yup.string()
        //     .required(messages.required)
        //     .VMValidation(anyChildrenUnder16Path, null, submissionVM)
    });

    const handleValidation = (isValid) => {
        setNavigation({ showForward: isValid, canForward: isValid });
    };

    return (
        <Container>
            <HDForm
                submissionVM={submissionVM}
                validationSchema={validationSchema}
                onValidation={handleValidation}
            >
                <Row>
                    <Col>
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: messages.headstitle }}
                            id="mc-driver-claims-button-group"
                            availableValues={availableValues}
                            label={{
                                text: messages.headstitle,
                                Tag: 'h2',
                                id: 'mc-driver-home-ownership'
                            }}
                            // onChange={() => setAnsweredHomeQue(true)}
                            btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                    </Col>
                </Row>
            </HDForm>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDMCDriverClaims.propTypes = {
    submissionVM: PropTypes.shape({
        value: PropTypes.shape({})
    }).isRequired,
    setNavigation: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCDriverClaims);
