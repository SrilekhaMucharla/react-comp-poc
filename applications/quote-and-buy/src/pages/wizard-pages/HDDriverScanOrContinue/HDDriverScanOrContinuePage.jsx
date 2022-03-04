// react
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Hastings
import {
    HDAlertRefactor, HDInfoCardRefactor, HDLabelRefactor
} from 'hastings-components';

import { useLocation } from 'react-router-dom';
// import styles from './HDDriverScanOrContinuePage.module.scss';
import { Col, Row, Container } from 'react-bootstrap';
import { AnalyticsHDButton as HDButton } from '../../../web-analytics';
import * as messages from './HDDriverScanOrContinuePage.messages';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import useAnotherDriver from '../__helpers__/useAnotherDriver';

// Resources
import discount from '../../../assets/images/wizard-images/discount.png';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';
import tipIcon from '../../../assets/images/icons/tip_circle_purple.svg';
import useRouterPageContext from '../__helpers__/useRouterPageContext';

export const HDDriverScanOrContinuePage = (props) => {
    const {
        handleForward,
        handleSkip,
        setNavigation,
        multiCarFlag
    } = props;

    // eslint-disable-next-line no-unused-vars
    const [driverIndex, isAnotherDriver, isAnotherDriverMulti] = useAnotherDriver(useLocation());
    const routerPageContext = useRouterPageContext(useLocation());

    useEffect(() => {
        const wizardTooltip = (
            <HDInfoCardRefactor
                id="page-scan-or-continue-wizard-tooltip"
                image={tipIcon}
                paragraphs={[messages.wizardTooltip(multiCarFlag ? isAnotherDriverMulti : isAnotherDriver)]} />
        );
        setNavigation({
            canSkip: false,
            canForward: false,
            showForward: false,
            showWizardTooltip: true,
            wizardTooltip: wizardTooltip
        });
    }, []);

    const handleScan = () => {
        handleForward({ routerPageContext: { errorMessage: null } });
    };

    const handleContinue = () => {
        handleSkip({ routerPageContext: { errorMessage: null } });
    };

    const discountTooltip = (<img src={discount} alt="discount" className="page-scan-or-continue__discount-img" />);

    return (
        <Container id="scan-or-continue" className="scan-or-continue">
            <Row>
                <Col>
                    <HDLabelRefactor
                        id="page-scan-or-continue-title"
                        className="page-scan-or-continue__title"
                        text={messages.scanOrContinueTitle(multiCarFlag ? isAnotherDriverMulti : isAnotherDriver)}
                        Tag="h2" />
                    {isAnotherDriver && (
                        <HDInfoCardRefactor
                            id="page-scan-or-continue-other-driver-info"
                            className="page-scan-or-continue__other-driver-info"
                            image={exclamationIcon}
                            paragraphs={[messages.additionDriverInfo]}
                            size="thin" />
                    )}
                </Col>
            </Row>
            <Row className="page-scan-or-continue__subtitle">
                <Col className="align-self-center pr-0">
                    <HDLabelRefactor
                        id="page-scan-or-continue-subtitle"
                        className="page-scan-or-continue__subtitle__label"
                        text={messages.otherDriverLabel(multiCarFlag ? isAnotherDriverMulti : isAnotherDriver)}
                        additionalContent={<h5 className="d-inline">{messages.optionalText(multiCarFlag ? isAnotherDriverMulti : isAnotherDriver)}</h5>}
                        Tag="h4" />
                </Col>
                <Col xs="auto" className="pl-2">
                    {discountTooltip}
                </Col>
            </Row>
            <Row>
                <Col>
                    <HDLabelRefactor
                        id="page-scan-or-continue-disclaimer"
                        className="page-scan-or-continue__disclaimer text-small"
                        text={messages.disclaimer}
                        Tag="p" />
                    <HDInfoCardRefactor
                        id="page-scan-or-continue-driving-information"
                        className="page-scan-or-continue__driving-information"
                        image={exclamationIcon}
                        paragraphs={[messages.tooltipContentLine1(multiCarFlag ? isAnotherDriverMulti : isAnotherDriver), messages.tooltipContentLine2(multiCarFlag ? isAnotherDriverMulti : isAnotherDriver)]} />
                    {routerPageContext.errorMessage && <HDAlertRefactor message={routerPageContext.errorMessage} />}
                </Col>
            </Row>
            <Row className="margin-top-lg-desktop-md-mobile col-elem-same-height">
                <Col xs={12} sm={6}>
                    <HDButton
                        webAnalyticsEvent={{ event_action: messages.scanOrContinueTitle(multiCarFlag ? isAnotherDriverMulti : isAnotherDriver) }}
                        id="page-scan-or-continue-button-scan-licence"
                        name="scan"
                        label={messages.scanLabel}
                        onClick={handleScan}
                        className="page-scan-or-continue__button-scan-licence btn-primary btn-block" />
                </Col>
                <Col xs={12} sm={6} className="mt-4 mt-sm-0">
                    <HDButton
                        webAnalyticsEvent={{ event_action: messages.scanOrContinueTitle(multiCarFlag ? isAnotherDriverMulti : isAnotherDriver) }}
                        id="page-scan-or-continue-button-continue"
                        name="continue"
                        label={messages.continueLabel}
                        onClick={handleContinue}
                        className="page-scan-or-continue__button-continue hd-btn-secondary btn-block" />
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        multiCarFlag: state.wizardState.app.multiCarFlag
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDDriverScanOrContinuePage.propTypes = {
    handleForward: PropTypes.func.isRequired,
    handleSkip: PropTypes.func.isRequired,
    setNavigation: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverScanOrContinuePage);
