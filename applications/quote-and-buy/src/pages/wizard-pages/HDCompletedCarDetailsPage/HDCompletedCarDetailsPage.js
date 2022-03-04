import React, {
    useEffect, useCallback, useState, useMemo
} from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import _ from 'lodash';
import {
    HDLabelRefactor
} from 'hastings-components';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDCompletedCardInfo as HDCompletedCardInfo
} from '../../../web-analytics';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import * as messages from './HDCompletedCarDetails.messages';
import formatRegNumber from '../../../common/formatRegNumber';
import { trackEvent } from '../../../web-analytics/trackData';

const HDCompletedCarDetailsPage = (props) => {
    const {
        submissionVM, setNavigation, handleForward, editQuoteJourney
    } = props;
    const dispatch = useDispatch();
    const [registrationNumber, setRegistrationNumber] = useState();
    const [make, setMake] = useState();
    const [model, setModel] = useState();
    const [year, setYear] = useState('');
    // eslint-disable-next-line no-unused-vars
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const fetchBusinessesFinalData = useCallback(() => {
        const vehicleVM = _.get(submissionVM, vehiclePath);
        setRegistrationNumber(vehicleVM.registrationsNumber.value !== undefined ? vehicleVM.registrationsNumber.value : null);
        setMake(vehicleVM.make.value !== undefined ? vehicleVM.make.value : '');
        setModel(vehicleVM.model.value !== undefined ? vehicleVM.model.value : '');
        setYear(vehicleVM.year.value !== undefined ? vehicleVM.year.value : '');
    }, [submissionVM]);

    useEffect(() => {
        // eslint-disable-next-line no-use-before-define
        fetchBusinessesFinalData();
    }, [fetchBusinessesFinalData]);

    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        dispatch(setNavigation({
            canForward: true,
            showForward: false,
            updateQuoteFlag: false,
            triggerLWRAPICall: false
        }));
    }, []);

    const onEditAction = () => {
        dispatch(setNavigation({
            isEditFromCarComplete: true
        }));
        handleForward({ isVehicleEdit: true });
    };

    const onContinueAction = () => {
        handleForward({ isInEditJourney: editQuoteJourney });
        dispatch(setNavigation({
            isEditFromCarComplete: false
        }));
    };

    const formattedRegNumber = useMemo(() => formatRegNumber(registrationNumber), [registrationNumber]);

    return (
        <Container fluid className="car-completed-details__container">
            <Row>
                <Col xs={12} xl={10} className="pr-4">
                    <HDLabelRefactor
                        className="car-completed-details__label"
                        Tag="h1"
                        text={messages.carDetailsSorted}
                        id="car-details-sorted-label" />
                    <div className="horizontal-line--bright" />
                    <HDCompletedCardInfo
                        webAnalyticsEvent={{ event_action: messages.carDetailsSorted }}
                        id="completed-card-car-info"
                        text={formattedRegNumber}
                        variant="car"
                        onEdit={onEditAction}
                        additionalText={`${year} ${make} ${model}`} />
                    <div className="horizontal-line--bright" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <HDButton
                        id="continue-to-driver-details-button"
                        webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                        onClick={onContinueAction}
                        label={messages.continueBtnLabel}
                        variant="primary"
                        className="car-completed-details__cont-btn" />
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        editQuoteJourney: state.wizardState.app.isEditQuoteJourney
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDCompletedCarDetailsPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    handleForward: PropTypes.func.isRequired,
    editQuoteJourney: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDCompletedCarDetailsPage);
