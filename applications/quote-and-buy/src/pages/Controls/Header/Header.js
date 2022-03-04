/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
    Navbar, Col, Row, Container
} from 'react-bootstrap';
import { HDButtonRefactor } from 'hastings-components';
import EventEmitter from '../../../EventHandler/event';
import hastingsLogo from '../../../assets/images/logo/hastings-logo.svg';
import directLogo from '../../../assets/images/logo/direct-logo.svg';
import HDFaq from '../HDFaq/HDFaq';
import crossClose from '../../../assets/images/wizard-images/hastings-icons/icons/Cross.svg';
import * as messages from './Header.messages';
import HDPrivacyPolicy from '../HDPrivacyPolicy/HDPrivacyPolicy';
import { getAmountAsTwoDecimalDigitsOrWhole } from '../../../common/premiumFormatHelper';


class Header extends Component {
    constructor() {
        super();
        this.state = {
            amount: null,
            prefix: null,
            text: '',
            // eslint-disable-next-line react/no-unused-state
            currency: '',
            hide: false
        };
        EventEmitter.subscribe('change', (event) => { this.getEventData(event); });
    }

    getEventData = (event) => {
        this.setState({
            amount: getAmountAsTwoDecimalDigitsOrWhole(event.price),
            prefix: event.prefix,
            text: event.text,
            // eslint-disable-next-line react/no-unused-state
            currency: event.currency,
            hide: event.hide
        });
        EventEmitter.unsubscribe('change', (e) => {
            this.priceChange(e);
        });
    }

    priceChange = () => { }

    hideHeader = (isHidden) => {
        if (isHidden) return ' fixed-header__hide-anim';
        return '';
    };

    render() {
        const {
            amount, prefix, text, hide
        } = this.state;

        const closePrivacyNotice = () => {
            document.body.classList.remove('privacy-policy-open');
        };

        return (
            <>
                <Container fluid className="fixed-header__privacy-notice">
                    <div className="fixed-header__privacy-notice-text">
                        <p className="mb-0">
                            {messages.howWeUseInformationText}
                            <HDPrivacyPolicy urlText="privacy policy" />
                        </p>
                    </div>
                    <div className="fixed-header__privacy-notice-dismiss">
                        <HDButtonRefactor
                            variant="default"
                            onClick={closePrivacyNotice}
                            label={<img width={24} height={24} src={crossClose} alt="close" />} />
                    </div>
                </Container>
                <div className={`fixed-header${this.hideHeader(hide)}`} id="headerFixedMain">
                    <Navbar>
                        <Navbar.Brand>
                            <img src={hastingsLogo} alt="Hastings" />
                            <img className="direct-logo" src={directLogo} alt="Direct" />
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end" id="headerJustifyContentEnd">
                            <Navbar.Text>
                                <HDFaq />
                            </Navbar.Text>
                            <Navbar.Text className="fixed-header-end" id="headerPolicyMainContainer" hidden={!amount}>
                                {amount && (
                                    <div className="fixed-header-price" id="headerPolicyAmount">
                                        {/* {prefix && (
                                                <div className="prefix">
                                                    {prefix}
                                                    &nbsp;
                                                </div>
                                            )
                                            <!-- commented for  defect 316231 shall be removed after impact analysis-->
                                            } */}
                                        <i className="fa fa-gbp" />
                                        {`£${(amount || '')}`}
                                    </div>
                                )}
                                {text && <div className="fixed-header-text" id="headerPolicyText">{text}</div>}
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </>
        );
    }
}

export default Header;
