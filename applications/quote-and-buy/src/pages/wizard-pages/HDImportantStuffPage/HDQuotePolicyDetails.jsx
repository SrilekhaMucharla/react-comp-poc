import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Container } from 'react-bootstrap';
import {
    HDContainer,
    HDInfoBox,
    HDLabelRefactor
} from 'hastings-components';
import _ from 'lodash';
import HastingsDirect from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-direct-oneline.svg';
import HastingsPremier from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-premier-oneline.svg';
import HastingsEssential from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-essential-oneline.svg';
import HastingsYouDrive from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-youdrive.svg';
import * as messages from './HDQuotePolicyDetails.messages';


const HDQuotePolicyDetails = ({
    policyType,
    brand,
    policyDetailsItems,
    optionalExtras,
    customizeSubmissionVM,
    isOnlineProductType,
}) => {
    const vehCoveragesPath = 'coverages.privateCar.vehicleCoverages';
    const vehCoverages = _.get(customizeSubmissionVM, `${vehCoveragesPath}.value`);
    let isDrivingOtherCarsSelected = false;
    if (vehCoverages && vehCoverages[0]) {
        isDrivingOtherCarsSelected = vehCoverages[0].coverages.find((vehicleCov) => vehicleCov.name === messages.drivingOtherCarsLabel).selected;
    }
    const policies = {
        HD: {
            logo: HastingsDirect,
            items: [
                { name: 'Courtesy car', description: messages.courtseyCarMessage }
            ],
        },
        HE: {
            logo: HastingsEssential,
            items: [
                { name: 'Courtesy car', description: messages.courtseyCarMessage }
            ],
            itemsNotCovered: [
                { name: 'Windscreen cover', description: messages.windcsreenNotCoveredMessage }
            ]
        },
        HP: {
            logo: HastingsPremier,
            items: [
                { name: 'Motor legal expenses' },
                { name: 'Roadside assistance' },
                { name: 'Courtesy car', description: messages.courtseyCarMessage }
            ],
        },
        YD: {
            logo: HastingsYouDrive,
            items: [
                { name: 'Courtesy car', description: messages.courtseyCarYDMessage }
            ],
        }
    };

    const getItemsCovered = (currentItems, coveredFlag) => {
        const items = currentItems || [];
        if (coveredFlag) {
            if (isDrivingOtherCarsSelected) {
                if (brand === 'YD') {
                    items.push({ name: messages.drivingOtherCars, description: messages.drivingOtherCarsYDMessage });
                } else {
                    items.push({ name: messages.drivingOtherCars, description: messages.drivingOtherCarsMessage });
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (!isDrivingOtherCarsSelected) {
                items.push({ name: messages.drivingOtherCars, description: messages.drivingOtherCarsNotCoveredMessage });
            }
        }
        return items;
    };


    return (
        <Row className="policy-details-container">
            <Col className="margin-bottom-md">
                <Row>
                    <Col className="px-md-0">
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.yourPolicy}
                            className="mb-2 margin-top-lg"
                            id="policy-details-your-policy-label" />
                        <p>{messages.yourPolicyDescription}</p>
                        <HDInfoBox policyDetails={policyDetailsItems} />
                    </Col>
                </Row>
                <Row>
                    <Col className="policy-details__cover margin-top-md">
                        {
                            isOnlineProductType && (
                                <Row>
                                    <Col className="mt-n4 mr-1 pt-1">
                                        <Container className="ml-5 mt-n3 logo-online-product container" />
                                    </Col>
                                </Row>
                            )
                        }

                        <HDContainer
                            isOnlineProductType={isOnlineProductType}
                            hastingsDirectLogo={policies[brand].logo}
                            isComprehensive={(policyType === 'comprehensive')}
                            items={getItemsCovered(policies[brand].items, true)}
                            itemsNotCovered={getItemsCovered(policies[brand].itemsNotCovered, false)} />
                        {optionalExtras && (optionalExtras.length > 0) && (
                            <HDContainer
                                title={messages.coverExtraTitle}
                                items={optionalExtras} />
                        )}


                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

HDQuotePolicyDetails.propTypes = {
    policyDetailsItems: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        value: PropTypes.string,
    })).isRequired,
    policyType: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    optionalExtras: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string
    })),
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }).isRequired,
    isOnlineProductType: PropTypes.bool
};

HDQuotePolicyDetails.defaultProps = {
    optionalExtras: null,
    isOnlineProductType: false
};

export default HDQuotePolicyDetails;
