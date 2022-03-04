import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import * as yup from 'hastings-components/yup';
import { HDForm } from 'hastings-components';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup
} from '../../../../web-analytics';
import {
    setNavigation as setNavigationAction, setErrorStatusCode
} from '../../../../redux-thunk/actions';
import * as messages from './HDMCDriverHomeOwnership.messages';
import useFullscreenLoader from '../../../Controls/Loader/useFullscreenLoader';
import { getLatestQuoteByInceptionDate } from '../../../../common/dateHelpers';
import HDQuoteService from '../../../../api/HDQuoteService';
import { getDataForUpdateMultiQuoteAPICall } from '../../../../common/submissionMappers';
import { trackAPICallFail, trackAPICallSuccess } from '../../../../web-analytics/trackAPICall';

const HDMCDriverHomeOwnership = ({
    setNavigation, submissionVM, handleForward, mcsubmissionVM
}) => {
    const [formIsValid, setFormIsValid] = useState();
    const dispatch = useDispatch();
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const firstDriverPath = 'value.lobData.privateCar.coverables.drivers[0]';

    const availableValues = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];

    const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';
    const ownYourHome = 'ownYourHome';
    const ownYourHomePath = `${driverPath}.${ownYourHome}`;
    const anyChildrenUnder16 = 'anyChildrenUnder16';
    const anyChildrenUnder16Path = `${driverPath}.${anyChildrenUnder16}`;

    useEffect(() => {
        setNavigation({ showForward: false, canForward: false });
    }, []);

    const validationSchema = yup.object({
        [ownYourHome]: yup.string()
            .required(messages.answerRequired)
            .VMValidation(ownYourHomePath, null, submissionVM),
        [anyChildrenUnder16]: yup.string()
            .required(messages.answerRequired)
            .VMValidation(anyChildrenUnder16Path, null, submissionVM)
    });

    const handleValidation = (isValid) => {
        setFormIsValid(isValid);
    };

    const triggerAPI = () => {
        HDQuoteService.updateMultiQuote(getDataForUpdateMultiQuoteAPICall(mcsubmissionVM.value))
            .then(({ result }) => {
                _.set(mcsubmissionVM, 'value', result);
                // check quote based on updated date and update the same object in submissionVM
                const getMCSubmissionVM = _.get(mcsubmissionVM, 'value.quotes');
                _.set(submissionVM, 'value', getLatestQuoteByInceptionDate(getMCSubmissionVM));
                trackAPICallSuccess('Update MC Quote');
                hideLoader();
                // move to driver allocation secondary page
                handleForward();
            }).catch((error) => {
                // error
                dispatch(setErrorStatusCode(error.status));
                trackAPICallFail('Update MC Quote', 'Update MC Quote Failed');
            });
    };

    // Continue button handler
    const continueHandler = () => {
        let mcQuote = _.get(mcsubmissionVM, 'value.quotes', []);
        // push the submissionVM to McSubmissionVM >>> check if same quote id is available in mcSubmissionVM
        const getSCQuoteID = _.get(submissionVM, 'value.quoteID', null);

        // to handle the back functionality if api is not triggered.
        mcQuote = mcQuote.filter((item) => item.quoteID !== undefined);

        if (mcQuote.length && getSCQuoteID === null) {
            // to add the policy holder and submission without quote id
            mcQuote.some((data) => {
                if (data.quoteID !== getSCQuoteID) {
                    _.set(submissionVM, 'value.isQuoteToBeUpdated', true);
                    _.set(submissionVM, `${firstDriverPath}.isPolicyHolder`, true);
                    return mcQuote.push(submissionVM.value);
                }
                return false;
            });
            if (getSCQuoteID === null) {
                _.set(mcsubmissionVM, 'value.quotes', mcQuote);
                triggerAPI();
                showLoader();
            }
        }
        if (mcQuote.length && getSCQuoteID !== null) {
            // to replace the policy holder from mcsubmission and submission is having the quote id
            mcQuote.some((data) => {
                if (data.quoteID !== getSCQuoteID) {
                    _.set(submissionVM, 'value.isQuoteToBeUpdated', true);
                    _.set(submissionVM, `${firstDriverPath}.isPolicyHolder`, true);
                    return mcQuote.push(submissionVM.value);
                }
                return false;
            });
            _.set(mcsubmissionVM, 'value.quotes', mcQuote);
            triggerAPI();
            showLoader();
        }
    };

    return (
        <>
            <Container className="hd-mc-home-ownership__container">
                <HDForm
                    submissionVM={submissionVM}
                    validationSchema={validationSchema}
                    onValidation={handleValidation}
                >
                    <Row>
                        <Col>
                            <HDToggleButtonGroup
                                webAnalyticsEvent={{ event_action: messages.homeOwnershipQue }}
                                id="mc-home-owner-button-group"
                                availableValues={availableValues}
                                label={{
                                    text: messages.homeOwnershipQue,
                                    Tag: 'h2',
                                    id: 'mc-driver-home-ownership'
                                }}
                                path={ownYourHomePath}
                                name={ownYourHome}
                                btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            <HDToggleButtonGroup
                                webAnalyticsEvent={{ event_action: messages.haveChildrenQue }}
                                id="mc-have-children-button-group"
                                availableValues={availableValues}
                                label={{
                                    text: messages.haveChildrenQue,
                                    Tag: 'h2',
                                    id: 'mc-driver-children'
                                }}
                                path={anyChildrenUnder16Path}
                                name={anyChildrenUnder16}
                                btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                        </Col>
                    </Row>
                </HDForm>
                <Row className="mt-4">
                    <Col>
                        <HDButton
                            webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                            id="continue-button"
                            className="margin-top-md margin-top-lg-lg"
                            onClick={continueHandler}
                            label="Continue"
                            variant="primary"
                            size="md"
                            disabled={!formIsValid} />
                    </Col>
                </Row>
            </Container>
            {HDFullscreenLoader}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDMCDriverHomeOwnership.propTypes = {
    submissionVM: PropTypes.shape({
        value: PropTypes.shape({})
    }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    handleForward: PropTypes.func.isRequired,
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.shape([])
    }).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCDriverHomeOwnership);
