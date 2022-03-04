import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';
import * as content from './HDVehicleDetailsHeader.messages';

const HDMCVehicleDetailsHeader = ({
    vehicleLicense,
    vehicleName,
    policyAddress,
    policyholder,
    noClaimsDiscountYears,
    namedDrivers
}) => {
    // sets up address to display postcode in one line
    const displayAddress = (address) => {
        let addressParts = [];
        if (address) {
            addressParts = address.split(',');
            if (addressParts.length === 3) {
                return (
                    <>
                        <span>{addressParts[0]}</span>
                        ,
                        <span>{addressParts[1]}</span>
                        ,
                        <span className="text-nowrap">{addressParts[2]}</span>
                    </>
                );
            }
        }
        return (<></>);
    };
    return (
        <Row as="header" className="mc-vehicle-details-header-container">
            <Col xs={12} lg={5} className="mc-vehicle-details-header__left-column">
                <div className="mc-vehicle-details-header__left-column__registration">
                    {vehicleLicense}
                </div>
                <HDLabelRefactor
                    Tag="h5"
                    text={vehicleName}
                    className="mb-0"
                    id="mc-vehicle-details-header-car-label" />
            </Col>
            <Col xs={12} lg={7} className="mc-vehicle-details-header__right-column">
                <Row noGutters>
                    <Col xs={12} lg={namedDrivers.length > 0 ? 6 : 12} className="mc-vehicle-details-header__right-column__item">
                        <Row>
                            <Col xs={6} lg={12} className="mc-vehicle-details-header__right-column__item__key">{content.policyholder}</Col>
                            <Col xs={6} lg={12}>
                                <div className="mc-vehicle-details-header__right-column__item__value">
                                    {policyholder}
                                </div>
                                <div className="mc-vehicle-details-header__right-column__item__value">
                                    <span className="font-bold">
                                        {noClaimsDiscountYears}
                                    </span>
                                    {content.yearsNoClaims(noClaimsDiscountYears)}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} lg={namedDrivers.length > 0 ? 6 : 12} className="mc-vehicle-details-header__right-column__item order-lg-last">
                        <Row>
                            <Col xs={6} lg={12} className="mc-vehicle-details-header__right-column__item__key">
                                {content.address}
                            </Col>
                            <Col xs={6} lg={12} className="mc-vehicle-details-header__right-column__item__value">
                                {displayAddress(policyAddress)}
                            </Col>
                        </Row>
                    </Col>
                    {(namedDrivers.length > 0) && (
                        <Col xs={12} lg={6} className="mc-vehicle-details-header__right-column__item">
                            <Row>
                                <Col xs={6} lg={12} className="mc-vehicle-details-header__right-column__item__key">
                                    {content.namedDrivers}
                                </Col>
                                <Col xs={6} lg={12}>
                                    {namedDrivers.map((driver) => (
                                        <div className="mc-vehicle-details-header__right-column__item__value" key={driver.publicID}>
                                            {driver.displayName}
                                        </div>
                                    ))}
                                </Col>
                            </Row>
                        </Col>
                    )}
                </Row>
            </Col>
        </Row>
    );
};

HDMCVehicleDetailsHeader.propTypes = {
    vehicleLicense: PropTypes.string.isRequired,
    vehicleName: PropTypes.string.isRequired,
    policyAddress: PropTypes.string.isRequired,
    policyholder: PropTypes.string.isRequired,
    noClaimsDiscountYears: PropTypes.string.isRequired,
    namedDrivers: PropTypes.arrayOf(PropTypes.shape({
        publicID: PropTypes.string,
        displayName: PropTypes.string
    })).isRequired
};

export default HDMCVehicleDetailsHeader;
