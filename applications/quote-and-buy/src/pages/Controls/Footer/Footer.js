/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useCookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
    Container, Row, Col, Collapse
} from 'react-bootstrap';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDModal as HDModal
} from '../../../web-analytics';

import * as messages from './Footer.messages';
import HDPrivacyPolicy from '../HDPrivacyPolicy/HDPrivacyPolicy';
import infoIcon from '../../../assets/images/icons/info-icon-light_blue.svg';
import {HDLabelRefactor} from "hastings-components";

function Footer(props) {
    const { name } = props;
    const year = new Date().getFullYear();

    const [cookies, setCookie] = useCookies(['cookieconsent_status']);
    const [cookieModal, setCookieModal] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
    }, [props]);

    useEffect(() => {
        if (!cookies.cookieconsent_status) {
            setCookieModal(true);
        }
    }, []);

    const handleCookie = () => {
        setCookie('cookieconsent_status', 'dismiss', {
            path: '/'
        });
        setCookieModal(false);
    };

    useEffect(() => {
        if (cookieModal) {
            document.body.classList.add('allow-scroll');
        } else {
            document.body.classList.remove('allow-scroll');
        }
    }, [cookieModal]);

    return (
        <div id="footerFixedFooter" className="fixed-footer">
            <Container>
                <Row>
                    <Col>
                        <HDModal
                            className="cookies-consent"
                            show={cookieModal}
                            hideClose
                            hideCancelButton
                            hideFooter
                        >
                            <Container fluid>
                                <Row>
                                    <Col xs={12} md={8}>
                                        <span>
                                            {messages.cookieConsent}
                                            <HDLabelRefactor
                                                Tag="a"
                                                text={messages.cookieModalText}
                                                className="secondary-style"
                                                href={messages.cookieLink}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            />
                                        </span>
                                    </Col>
                                    <Col xs={12} md={4} className="pt-3 pt-md-0">
                                        <HDButton
                                            variant="primary"
                                            size="md"
                                            label="OK"
                                            onClick={handleCookie}
                                            className="theme-white w-100" />
                                    </Col>
                                </Row>
                            </Container>
                        </HDModal>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className="footer-text-style" id="footer-links-text-style">
                            <HDLabelRefactor Tag="a" target="_blank" text={messages.feesText} href={messages.feesLink} className="secondary-style"/>
                            <HDLabelRefactor Tag="a" target="_blank" text={messages.termsText} href={messages.termsLink} className="secondary-style"/>
                            <HDLabelRefactor Tag="a" target="_blank" text={messages.termsOfUseText} href={messages.termsOfUseLink} className="secondary-style"/>
                            <HDPrivacyPolicy urlText="Privacy policy" />
                            <HDLabelRefactor Tag="a" target="_blank" text={messages.cookieText} href={messages.cookieLink} className="secondary-style"/>
                            <HDLabelRefactor Tag="a" target="_blank" text={messages.accessibilityText} href={messages.accessibilityLink} className="secondary-style"/>
                            <HDLabelRefactor Tag="a" target="_blank" text={messages.infoText} href={messages.infoLink} className="secondary-style"/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className="footer-text-style" id="footer-text-style">
                            &copy;
                            <span>
                                {year}
                                {' '}
                                {name}
                            </span>

                            <img
                                className="info-collapse-icon"
                                src={infoIcon}
                                alt="Info Icon Img"
                                onClick={() => setOpen(!open)}
                                aria-controls="info-collapse-text"
                                aria-expanded={open} />

                            <Collapse in={open}>
                                <div id="info-collapse-text" className="info-collapse-text">
                                    <span>{messages.infoDescription1}</span>
                                    <span>{messages.infoDescription2}</span>
                                </div>
                            </Collapse>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

Footer.propTypes = {
    name: PropTypes.string.isRequired
};

export default withRouter(Footer);
