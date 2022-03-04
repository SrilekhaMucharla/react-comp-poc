// react
import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
// Hastings
import {
    HDAlertRefactor, HDInfoCardRefactor, HDLabelRefactor
} from 'hastings-components';
import { useLocation } from 'react-router-dom';
import { Col, Row, Container } from 'react-bootstrap';
import { AnalyticsHDButton as HDButtonRefactor } from '../../../web-analytics';
import * as messages from './HDMCHeadsUpPage.messages';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import useAnotherDriver from '../__helpers__/useAnotherDriver';

// Resources
import discount from '../../../assets/images/wizard-images/discount.png';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';
import tipIcon from '../../../assets/images/icons/tip_circle_purple.svg';
import useRouterPageContext from '../__helpers__/useRouterPageContext';

const HDMCHeadsUpPage = (props) => {
    const {
        handleForward,
        handleSkip,
        setNavigation
    } = props;

    // eslint-disable-next-line no-unused-vars
    const [driverIndex, isAnotherDriver] = useAnotherDriver(useLocation());
    const routerPageContext = useRouterPageContext(useLocation());
    const [understandClicked, setunderstandClicked] = useState(false);
    const [hideunderstandSection, setHideunderstandSection] = useState(true);
    const MCsubmissionVM = useSelector((state) => state.wizardState.data.mcsubmissionVM);
    useEffect(() => {
        window.scroll(0, 0);
        setNavigation({
            canSkip: false,
            canForward: false,
            showForward: false
        });
    }, []);

    useEffect(() => {
        const getMCSubmissionVM = _.get(MCsubmissionVM, 'value.accountHolder.accountHolder', null);
        if (getMCSubmissionVM) {
            setunderstandClicked(true);
            setHideunderstandSection(false);
        } else {
            setunderstandClicked(false);
            setHideunderstandSection(true);
        }
    }, [MCsubmissionVM.value.quotes]);

    const handleScan = () => {
        handleForward();
    };

    const handleContinue = () => {
        handleSkip();
    };

    const understandbuttonHandle = () => {
        setunderstandClicked(true);
    };

    const discountTooltip = (<img src={discount} alt="discount" className="page-scan-or-continue__discount-img" />);

    return (
        <>
            { hideunderstandSection ? (
                <Container className="mc-scan-or-continue-heads-up-container">
                    <HDLabelRefactor
                        className="label"
                        text={messages.headstitle}
                        Tag="h1" />
                    <HDInfoCardRefactor
                        id="page-scan-or-continue-other-driver-info"
                        className="page-scan-or-continue__other-driver-info"
                        image={exclamationIcon}
                        paragraphs={[messages.headsupText]}
                        size="thin" />
                    <Row className="margin-top-lg">
                        <Col>
                            <HDButtonRefactor
                                webAnalyticsEvent={{ event_action: messages.headstitle }}
                                id="page-scan-or-continue-button-scan-licence"
                                name="scan"
                                label={messages.understandText}
                                onClick={understandbuttonHandle}
                                className="btn-primary"
                                size="md" />
                        </Col>
                    </Row>
                </Container>
            ) : ''
            }
            {
                understandClicked ? (
                    <Container id="scan-or-continue" className="scan-or-continue">
                        <Row>
                            <Col>
                                {/* <HDLabelRefactor
                                    id="page-scan-or-continue-title"
                                    className="page-scan-or-continue__title"
                                    text={isAnotherDriver ? messages.otherDriverHeader : messages.header}
                                    Tag="h1" /> */}
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
                                    text={isAnotherDriver ? messages.otherDriverLabel : messages.label}
                                    additionalContent={isAnotherDriver ? <h5 className="d-inline">{messages.optionalText}</h5> : undefined}
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
                                    paragraphs={[messages.tooltipContentLine1(isAnotherDriver), messages.tooltipContentLine2(isAnotherDriver)]} />

                                {routerPageContext.errorMessage && <HDAlertRefactor message={routerPageContext.errorMessage} />}
                            </Col>
                        </Row>
                        <Row className="margin-top-lg-desktop-md-mobile col-elem-same-height">
                            <Col xs={12} sm={6}>
                                <HDButtonRefactor
                                    webAnalyticsEvent={{ event_action: isAnotherDriver ? messages.otherDriverHeader : messages.label }}
                                    id="page-scan-or-continue-button-scan-licence"
                                    name="scan"
                                    label={messages.scanLabel}
                                    onClick={handleScan}
                                    variant="primary"
                                    className="page-scan-or-continue__button-scan-licence btn-block" />
                            </Col>
                            <Col xs={12} sm={6} className="mt-2 mt-sm-0">
                                <HDButtonRefactor
                                    webAnalyticsEvent={{ event_action: isAnotherDriver ? messages.otherDriverHeader : messages.label }}
                                    id="page-scan-or-continue-button-continue"
                                    name="continue"
                                    label={messages.continueLabel}
                                    onClick={handleContinue}
                                    variant="secondary"
                                    className="page-scan-or-continue__button-continue btn-block" />
                            </Col>
                        </Row>
                        <HDInfoCardRefactor
                            id="page-scan-or-continue-wizard-tooltip"
                            image={tipIcon}
                            paragraphs={[messages.wizardTooltip]}
                            className="margin-top-lg-desktop-md-mobile" />
                    </Container>
                ) : ''
            }
        </>
    );
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDMCHeadsUpPage.propTypes = {
    handleForward: PropTypes.func.isRequired,
    handleSkip: PropTypes.func.isRequired,
    setNavigation: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(HDMCHeadsUpPage);
