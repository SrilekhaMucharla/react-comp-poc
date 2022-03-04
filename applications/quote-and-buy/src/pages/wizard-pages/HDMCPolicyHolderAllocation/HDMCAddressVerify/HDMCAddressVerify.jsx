import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import {
    HDLabelRefactor, HDInfoCardRefactor
} from 'hastings-components';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup
} from '../../../../web-analytics';
import { setNavigation as setNavigationAction } from '../../../../redux-thunk/actions';
import * as messages from './HDMCAddressVerify.messages';
import TipCirclePurple from '../../../../assets/images/icons/tip_circle_purple.svg';
import BackNavigation from '../../../Controls/BackNavigation/BackNavigation';


const HDMCAddressVerify = ({
    handleForward, mcsubmissionVM, submissionVM, setNavigation, handleBackward
}) => {
    let accountHolderAddressObject;
    mcsubmissionVM.value.quotes.map((quoteObject) => {
        if (quoteObject.isParentPolicy) { accountHolderAddressObject = _.cloneDeep(quoteObject.baseData.policyAddress); }
        return null;
    });
    const [addressVerified, setaddressVerified] = useState(true);
    const availableValues = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];

    const removebtnHandler = () => {
        return true;
    };

    // update mcsubmission to handle back
    const updateMCSubmission = () => {
        return new Promise(async (resolve) => {
            const mcQuote = _.get(mcsubmissionVM, 'value.quotes', []);
            const getSCQuoteID = _.get(submissionVM, 'value.quoteID', null);
            mcQuote.some((data) => {
                if (data.quoteID !== getSCQuoteID) {
                    return mcQuote.push(_.cloneDeep(submissionVM.value));
                }
                return false;
            });
            _.set(mcsubmissionVM, 'value.quotes', _.cloneDeep(mcQuote));
            resolve();
        });
    };

    const handleBackwardEvent = () => {
        updateMCSubmission().then(() => {
            handleBackward({ notAPolicyHolder: true });
        });
    };

    const addressVerificationHandler = (event) => {
        if (event.target.value === 'true') {
            handleForward();
            setaddressVerified(true);
        } else setaddressVerified(false);
    };

    const chooseAnotherPHHandler = () => {
        updateMCSubmission().then(() => {
            _.set(submissionVM, 'value.lobData.privateCar.coverables.drivers', []);
            _.set(submissionVM, 'value.lobData.privateCar.coverables.vehicleDrivers', []);
            handleForward({ chooseAnotherPH: true });
        });
    };

    useEffect(() => {
        setNavigation({ showForward: false });
    }, []);

    return (
        <Container className="address-verify__container">
            <Row>
                <Col>
                    <BackNavigation
                        id="backAddressVerify"
                        className="mt-3"
                        onClick={() => handleBackwardEvent()}
                        onKeyPress={() => handleBackwardEvent()} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <HDLabelRefactor
                        Tag="h2"
                        text={messages.addressVerificationQue} />
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <HDInfoCardRefactor paragraphs={[accountHolderAddressObject.displayName]} className="mc-address-verify__info-card" />
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <HDToggleButtonGroup
                        webAnalyticsEvent={{ event_action: messages.addressVerificationQue }}
                        id="mc-do-they-live-here-button-group"
                        availableValues={availableValues}
                        onChange={addressVerificationHandler}
                        btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                </Col>
            </Row>
            {!addressVerified && (
                <>
                    <Row className="mb-4">
                        <Col>
                            <HDInfoCardRefactor
                                className="address-verify__info-card"
                                image={TipCirclePurple}
                                paragraphs={[messages.diffAddressinfoCardText]} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDButton
                                webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                                id="continue-button"
                                onClick={chooseAnotherPHHandler}
                                label={messages.anotherPHBtnText}
                                variant="primary"
                                size="sm" />
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDMCAddressVerify.propTypes = {
    submissionVM: PropTypes.shape({
        value: PropTypes.shape({})
    }).isRequired,
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.object
    }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    handleForward: PropTypes.func.isRequired,
    handleBackward: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCAddressVerify);
