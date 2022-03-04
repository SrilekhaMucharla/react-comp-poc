import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { HASTINGS_ESSENTIAL } from '../../constant/const';
import * as messages from './HastingsInterstitialPage.messages';
import insuranceprovidericon from '../../assets/images/icons/insurance-provider-icon.png';
import { defaqtoSrc } from '../../constant/const';


const HastingsInterstitialRatingsWizardComponent = ({
    brand
}) => (
    <Row className="interstitial-ratings-wizard">
        { (brand !== HASTINGS_ESSENTIAL) && (
            <Col className="text-center">
                <img className="img-fluid" src={defaqtoSrc} alt="Defaqto2" />
                <p>{messages.defaqtoLabel}</p>
            </Col>
        )}
        <Col className="text-center">
            <img src={insuranceprovidericon} className="main-logo" alt="car insurance provider" />
            <p className="interstitial-ratings-moneyFacts">{messages.moneyfactsLabel}</p>
        </Col>
    </Row>
);

HastingsInterstitialRatingsWizardComponent.propTypes = {
    brand: PropTypes.string
};

HastingsInterstitialRatingsWizardComponent.defaultProps = {
    brand: null
};

export default HastingsInterstitialRatingsWizardComponent;
